local auth_utils = require("auth_utils")

local payload, err = auth_utils.verify_and_extract()

if not payload then
    ngx.status = 401
    ngx.say('{"error": "' .. (err or "unauthorized") .. '"}')
    return ngx.exit(401)
end

-- Inject headers for downstream services
ngx.req.set_header("X-User-ID", payload.userId or payload.sub or "anonymous")

if payload.roles then
    local roles = payload.roles
    if type(roles) == "table" then
        roles = table.concat(roles, " ")
    end
    ngx.req.set_header("X-User-Roles", roles)
end
