import asyncio
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

csv_content = """Lead ID,Lead Amount,Status,Sales Rep,Pipeline Stage,Lead Source,Random Col
L-100,50000,Open,John Doe,Qualified,Website,Something
L-101,100000,Closed Won,Jane Smith,Closed,Referral,Else
L-102,,,Unknown Rep,,,
"""

def test():
    files = {'file': ('test.csv', csv_content, 'text/csv')}
    response = client.post("/upload", files=files)
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 201:
        data = response.json()
        print(f"Dataset Type: {data.get('dataset_type')}")
        print(f"Confidence Score: {data.get('confidence_score')}")
        print("Summary:")
        print(data.get('summary'))
        print("Diagnostics:")
        print(data.get('diagnostics'))
        print("First Normalized Record:")
        if data.get('normalized_data'):
            print(data['normalized_data'][0])
    else:
        print(response.text)

if __name__ == "__main__":
    test()
