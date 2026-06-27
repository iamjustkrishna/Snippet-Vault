import urllib.request
import urllib.parse
import json
import time

BASE_URL = "http://127.0.0.1:8001"

def request(method, path, data=None):
    url = BASE_URL + path
    headers = {}
    body = None
    if data:
        body = json.dumps(data).encode('utf-8')
        headers['Content-Type'] = 'application/json'
        
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            if response.status == 204:
                return {"status": 204}
            return json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        if e.code == 204: 
            return {"status": 204}
        return {"error": e.code, "msg": e.read().decode('utf-8')}
    except Exception as e:
        return {"error": str(e)}

print("Waiting for server to start...")
time.sleep(2)

print("--- Testing Create ---")
s1 = request("POST", "/snippets/", {"title": "Hello World", "language": "python", "code": "print('hello')", "tags": "test,basic"})
print("Created 1:", s1)

s2 = request("POST", "/snippets/", {"title": "FastAPI Setup", "language": "python", "code": "import fastapi", "tags": "web,framework"})
print("Created 2:", s2)

s3 = request("POST", "/snippets/", {"title": "JS snippet", "language": "javascript", "code": "console.log('js')", "tags": "test"})
print("Created 3:", s3)

print("\n--- Testing Search ---")
res = request("GET", "/snippets/?q=python")
print(f"Search 'python' (Expected 2): found {len(res) if isinstance(res, list) else res} -> {[s['title'] for s in res] if isinstance(res, list) else []}")

print("\n--- Testing Pagination ---")
# There are 3 total. page 1, limit 2 should return 2
p1 = request("GET", "/snippets/?page=1&limit=2")
p2 = request("GET", "/snippets/?page=2&limit=2")
print(f"Page 1 (limit 2) returned {len(p1) if isinstance(p1, list) else p1} snippets")
print(f"Page 2 (limit 2) returned {len(p2) if isinstance(p2, list) else p2} snippets")

print("\n--- Testing Delete ---")
if isinstance(s1, dict) and "id" in s1:
    d = request("DELETE", f"/snippets/{s1['id']}")
    print("Delete s1 status:", d)
    
    check = request("GET", f"/snippets/?q=Hello")
    print("Search 'Hello' after delete (Expected 0): found", len(check) if isinstance(check, list) else check)
