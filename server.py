import http.server
import socketserver
import json
import urllib.request
import urllib.error
import os
import webbrowser

PORT = 3000
AIMICROMIND_FLOW_ID = "46281994-dab4-493e-bf56-3b386f42d4d4"
AIMICROMIND_API_URL = f"https://core.aimicromind.com/api/v1/prediction/{AIMICROMIND_FLOW_ID}"

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/generate':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                req_json = json.loads(post_data.decode('utf-8'))
                question = req_json.get('question', 'Hello')
                print(f"[Localhost] Forwarding to AiMicromind: {question[:60]}...")

                # Send request to AiMicromind
                payload = json.dumps({"question": question}).encode('utf-8')
                req = urllib.request.Request(
                    AIMICROMIND_API_URL,
                    data=payload,
                    headers={'Content-Type': 'application/json'}
                )
                
                with urllib.request.urlopen(req, timeout=30) as response:
                    res_body = response.read().decode('utf-8')
                    res_data = json.loads(res_body)
                    output_text = res_data.get('text') or res_data.get('response') or str(res_data)

                # Respond to frontend
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "text": output_text}).encode('utf-8'))

            except Exception as e:
                print(f"[Error] {e}")
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
        else:
            self.send_error(404, "Not Found")

# Run Server
os.chdir(os.path.dirname(os.path.abspath(__file__)))
with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    print("=" * 55)
    print(f"🚀 GrowthOS Local Server is running on: http://localhost:{PORT}")
    print(f"🔗 Connected to AiMicromind Flow ID: {AIMICROMIND_FLOW_ID}")
    print("=" * 55)
    try:
        webbrowser.open(f"http://localhost:{PORT}")
    except:
        pass
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
