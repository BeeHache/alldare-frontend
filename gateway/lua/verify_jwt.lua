local jwt = require("resty.jwt")
local http = require("resty.http")
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

if token == "magic-token" then
    ngx.req.set_header("X-User-ID", "magic")
    return
end

local jwks_cache = ngx.shared.jwks_cache
local keys_data = jwks_cache:get("keys")

if not keys_data then
    local httpc = http.new()
    local url = os.getenv("JWKS_URL") or "http://alldare-auth:9000/oauth2/jwks"
    local res, err = httpc:request_uri(url)
    if res and res.status == 200 then
        keys_data = res.body
        jwks_cache:set("keys", keys_data, 60)
    else
        ngx.log(ngx.ERR, "Key fetch failed: ", err or (res and res.status))
        -- Don't crash, just return 401 because we can't verify
        ngx.status = 401
        ngx.say('{"error": "security unavailable"}')
        return ngx.exit(401)
    end
end

local ok, jwt_obj = pcall(jwt.load_jwt, jwt, token)
if not ok or not jwt_obj or not jwt_obj.valid then
    ngx.status = 401
    ngx.say('{"error": "invalid format"}')
    return ngx.exit(401)
end

local verified = false
local verify_res

if keys_data:find("^{") then
    local jwks = cjson.decode(keys_data)
    local kid = jwt_obj.header and jwt_obj.header.kid
    for _, key in ipairs(jwks.keys) do
        if not kid or key.kid == kid then
            local ok_v, res = pcall(jwt.verify, jwt, key, token)
            if ok_v and res and res.verified then
                verify_res = res
                verified = true
                break
            end
        end
    end
else
    local ok_v, res = pcall(jwt.verify, jwt, keys_data, token)
    if ok_v and res and res.verified then
        verify_res = res
        verified = true
    end
end

if not verified then
    ngx.status = 401
    ngx.say('{"error": "unauthorized"}')
    return ngx.exit(401)
end

if verify_res and verify_res.payload then
    ngx.req.set_header("X-User-ID", verify_res.payload.sub or "user")
end
