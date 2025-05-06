// generate-curls.js
const fs = require('fs');
const path = require('path');
const { faker } = require('@faker-js/faker');

const CONTROLLERS_PATH = path.join(__dirname, 'src', 'modules');
const HTTP_METHODS = ['Get', 'Post', 'Put', 'Delete', 'Patch'];

function parseControllerFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const routes = [];
    const classMatch = content.match(/@Controller\((['"`])(.*?)\1\)/);
    const basePath = classMatch ? classMatch[2] : '';

    // Ajuste: permite decoradores extras entre @Post e o método
    const methodRegex = new RegExp(
        `@(${HTTP_METHODS.join('|')})\\(([^)]*)\\)[\\s\\S]*?([\\w]+)\\(([^)]*)\\)`,
        'g'
    );

    let match;
    while ((match = methodRegex.exec(content)) !== null) {
        const [, http, rawPath, handler, params] = match;
        const method = http.toUpperCase();
        const subPath = rawPath.trim().replace(/['"`]/g, '');
        const url = `/${basePath}${subPath ? `/${subPath}` : ''}`.replace(/\/\/+/, '/');

        // detecta DTO em @Body()
        let bodyDto = null;
        const bodyParam = params.split(',').find(p => p.includes('@Body'));
        if (bodyParam) {
            const dtoMatch = bodyParam.match(/:\s*([\w]+)/);
            if (dtoMatch) bodyDto = dtoMatch[1];
        }

        routes.push({ method, url, params, bodyDto, controllerPath: filePath });
    }

    return routes;
}

function findDtoFile(dtoName, modulePath) {
    const dtoDir = path.join(modulePath, 'dtos');
    if (!fs.existsSync(dtoDir)) return null;
    const files = fs.readdirSync(dtoDir);
    const match = files.find(f => f.toLowerCase().includes(dtoName.toLowerCase()));
    return match ? path.join(dtoDir, match) : null;
}

function extractDtoFields(dtoPath) {
    const content = fs.readFileSync(dtoPath, 'utf8');
    const lines = content.split('\n');
    const fields = [];
    let decor = [];

    for (const lineRaw of lines) {
        const line = lineRaw.trim();
        if (line.startsWith('@')) {
            decor.push(line);
            continue;
        }
        const m = line.match(/^(\w+):\s*([\w\[\]]+);?/);
        if (m) {
            let [, name, declared] = m;
            let type = declared.toLowerCase();
            if (decor.some(d => d.includes('IsEmail'))) type = 'email';
            else if (decor.some(d => d.includes('IsUUID'))) type = 'uuid';
            else if (decor.some(d => d.includes('IsDateString'))) type = 'date';
            else if (decor.some(d => d.includes('IsEnum'))) type = 'enum';
            else if (decor.some(d => d.includes('IsNumber'))) type = 'number';
            else if (decor.some(d => d.includes('IsBoolean'))) type = 'boolean';
            else if (decor.some(d => d.includes('IsString'))) type = 'string';
            fields.push({ name, type });
            decor = [];
        }
    }
    return fields;
}

function extractInlineFields(params) {
    const inlineMatch = params.match(/@Body\(\)\s*\w+\s*:\s*{([^}]+)}/s);
    if (!inlineMatch) return [];
    const inside = inlineMatch[1];
    return inside
        .split(';')
        .map(s => s.trim())
        .filter(s => s)
        .map(pair => {
            const [name, typ] = pair.split(':').map(x => x.trim());
            return { name, type: typ.toLowerCase() };
        });
}

function mockValue(type) {
    switch (type) {
        case 'email': return faker.internet.email();
        case 'uuid': return faker.string.uuid();
        case 'date': return faker.date.past().toISOString();
        case 'number': return faker.number.int();
        case 'boolean': return faker.datatype.boolean();
        case 'enum': return 'ENUM_VALUE';
        case 'string':
        default: return faker.lorem.word();
    }
}

function buildJsonExample(fields) {
    const obj = {};
    for (const f of fields) {
        obj[f.name] = mockValue(f.type);
    }
    return JSON.stringify(obj, null, 2);
}

function replacePathParams(url) {
    return url.replace(/:([a-zA-Z]+)/g, (_, param) => {
        const p = param.toLowerCase();
        if (p.includes('user') || p.includes('id')) return faker.string.uuid();
        if (p.includes('movie')) return faker.string.alphaNumeric(8);
        return 'example';
    });
}

function generateCurl(route) {
    const { method, url, bodyDto, controllerPath, params } = route;
    const needsBody = ['POST', 'PUT', 'PATCH'].includes(method);
    const fullUrl = replacePathParams(url);

    let dataPart = '';
    if (needsBody) {
        let fields = [];
        if (bodyDto) {
            const dtoFile = findDtoFile(bodyDto, path.dirname(controllerPath));
            if (dtoFile) fields = extractDtoFields(dtoFile);
        }
        if (!fields.length) fields = extractInlineFields(params);
        const json = fields.length ? buildJsonExample(fields) : '{}';
        dataPart = ` -H "Content-Type: application/json" -d '${json.replace(/\n/g, '')}'`;
    }

    return `curl -X ${method} http://localhost:3000${fullUrl}${dataPart}`;
}

function findAllControllers(dir) {
    return fs.readdirSync(dir).flatMap(file => {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) return findAllControllers(full);
        return file.endsWith('.controller.ts') ? [full] : [];
    });
}

function printGroupedCurls() {
    const controllers = findAllControllers(CONTROLLERS_PATH);
    const grouped = {};

    controllers.forEach(file => {
        const rel = path.relative(process.cwd(), file);
        const curls = parseControllerFile(file).map(generateCurl);
        if (curls.length) grouped[rel] = curls;
    });

    Object.entries(grouped).forEach(([file, curls]) => {
        console.log('\n' + file);
        console.log('-'.repeat(file.length));
        curls.forEach(cmd => console.log('  ' + cmd));
    });
    console.log();
}

printGroupedCurls();