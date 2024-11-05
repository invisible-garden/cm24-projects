from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import dh

# Generate parameters for the Diffie-Hellman key exchange
parameters = dh.generate_parameters(generator=2, key_size=2048)

# Each participant generates their private and public keys
def generate_key_pair(parameters):
    private_key = parameters.generate_private_key()
    public_key = private_key.public_key()
    return private_key, public_key

# Simulate three participants
private_key_a, public_key_a = generate_key_pair(parameters)
private_key_b, public_key_b = generate_key_pair(parameters)
private_key_c, public_key_c = generate_key_pair(parameters)

# Exchange public keys
public_keys = [
    public_key_a.public_bytes(encoding=serialization.Encoding.PEM, format=serialization.PublicFormat.SubjectPublicKeyInfo),
    public_key_b.public_bytes(encoding=serialization.Encoding.PEM, format=serialization.PublicFormat.SubjectPublicKeyInfo),
    public_key_c.public_bytes(encoding=serialization.Encoding.PEM, format=serialization.PublicFormat.SubjectPublicKeyInfo),
]

# Compute the shared secret
def compute_shared_secret(private_key, public_key_bytes):
    public_key = serialization.load_pem_public_key(public_key_bytes)
    return private_key.exchange(public_key)

shared_secret_a = compute_shared_secret(private_key_a, public_keys[1])
shared_secret_b = compute_shared_secret(private_key_b, public_keys[2])
shared_secret_c = compute_shared_secret(private_key_c, public_keys[0])

# Verify that the shared secrets are the same
assert shared_secret_a == shared_secret_b == shared_secret_c

print("Shared secret:", shared_secret_a.hex())