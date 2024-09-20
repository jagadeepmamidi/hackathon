from flask import Flask, request, jsonify

app = Flask(__name__)

# In-memory storage for services
services = []

# Handle POST request to add a service
@app.route('/add-service', methods=['POST'])
def add_service():
    input_data = request.get_json()
    
    # Validate input data
    if 'name' not in input_data or 'description' not in input_data or 'price' not in input_data:
        return jsonify({"status": "error", "message": "Missing required parameters"}), 400

    # Add the service to the list
    services.append({
        "name": input_data['name'],
        "description": input_data['description'],
        "price": input_data['price']
    })

    # Mock transaction receipt
    transaction_receipt = {
        "blockHash": "0x123...",
        "transactionHash": "0xabc...",
        "gasUsed": 21000,
        "status": 1
    }

    response_data = {
        "status": "Service Added",
        "receipt": transaction_receipt  # Optional, for debugging
    }

    return jsonify(response_data), 200

# Handle GET request to retrieve services
@app.route('/get-services', methods=['GET'])
def get_services():
    return jsonify(services), 200

if __name__ == '__main__':
    app.run(debug=True)
