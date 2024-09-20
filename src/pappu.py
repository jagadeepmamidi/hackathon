import json
from flask import Flask, render_template, request, jsonify, redirect, url_for
import os
from web3 import Web3

blockchain_url = "http://127.0.0.1:7545"  # Ensure this matches your Ganache or node setup
web3 = Web3(Web3.HTTPProvider(blockchain_url))

# Check if connected to blockchain
if web3.is_connected():
    print("Successfully connected to the blockchain.")
else:
    raise Exception("Cannot connect to the blockchain. Please check Ganache is running.")

contract_address = "0xbACc90d5A0CaB656Dc5ed8149301F19D6FB7813D"  # Replace with your deployed contract address

compiled_contract_path = os.path.join(os.path.dirname(__file__), "../build/contracts/Marketplace.json")
if not os.path.exists(compiled_contract_path):
    raise Exception("Compiled contract file not found. Please ensure it exists.")

with open(compiled_contract_path, "r") as file:
    audit_contract_json = json.load(file)
    audit_contract_abi = audit_contract_json["abi"]

contract = web3.eth.contract(address=contract_address, abi=audit_contract_abi)

# Set default account
web3.eth.default_account = web3.eth.accounts[0]
