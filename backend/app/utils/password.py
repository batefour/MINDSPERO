"""Password hashing and verification utilities.

Using PBKDF2-HMAC-SHA256 to avoid dependency issues with the bcrypt
binary on certain environments. The functions return/expect a string
with the salt and derived key hex-encoded and separated by a colon.
"""
import hashlib
import os


def _pbkdf2_hash(password: str, salt: bytes, iterations: int = 100_000) -> bytes:
    return hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations)


def hash_password(password: str) -> str:
    """Hash a password using PBKDF2-HMAC-SHA256.

    Returns: "{salt_hex}:{dk_hex}" where both parts are hex strings.
    """
    salt = os.urandom(16)
    dk = _pbkdf2_hash(password, salt)
    return salt.hex() + ":" + dk.hex()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a stored PBKDF2 hash."""
    try:
        salt_hex, dk_hex = hashed_password.split(":")
    except ValueError:
        return False
    salt = bytes.fromhex(salt_hex)
    expected = bytes.fromhex(dk_hex)
    actual = _pbkdf2_hash(plain_password, salt)
    return hashlib.compare_digest(actual, expected)
