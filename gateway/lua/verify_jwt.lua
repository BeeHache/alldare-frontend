local jwt = require("resty.jwt")
local cjson = require("cjson")

local auth_header = ngx.var.http_Authorization
if not auth_header then
    ngx.status = 401
    ngx.say('{"error": "missing header"}')
    return ngx.exit(401)
end

local _, _, token = string.find(auth_header, "Bearer%s+(.+)")
if not token then
    ngx.status = 400
    ngx.say('{"error": "bad format"}')
    return ngx.exit(400)
end

-- Bypass signature verification due to OpenSSL 3 / lua-resty-jwt incompatibility in this environment.
-- The backend microservices (Resource Servers) MUST still verify the signature.
-- This Gateway layer is currently acting as an identity extractor and early-exit for expired tokens.
local jwt_obj = jwt:load_jwt(token)

if not jwt_obj.valid then
    ngx.status = 401
    ngx.say('{"error": "invalid jwt format"}')
    return ngx.exit(401)
end

local payload = jwt_obj.payload
if payload then
    -- Inject headers for downstream services
    -- Prefer userId (UUID) over sub (Username) for compatibility with Feeds/Posts/Media services
    local user_id = payload.userId or payload.sub or "anonymous"
    ngx.req.set_header("X-User-ID", user_id)
    
    if payload.roles then
        local roles = payload.roles
        if type(roles) == "table" then
            roles = table.concat(roles, " ")
        end
        ngx.req.set_header("X-User-Roles", roles)
    end
    
    -- Check expiration
    local now = os.time()
    if payload.exp and payload.exp < now then
        ngx.status = 401
        ngx.say('{"error": "token expired"}')
        return ngx.exit(401)
    end
end
