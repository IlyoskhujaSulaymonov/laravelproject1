# Create SSL directory if it doesn't exist
$sslDir = "storage\ssl"
if (!(Test-Path $sslDir)) {
    New-Item -ItemType Directory -Path $sslDir
}

# Generate private key and certificate using OpenSSL
# Make sure OpenSSL is installed and in your PATH
& openssl genrsa -out "$sslDir\key.pem" 2048
& openssl req -new -x509 -key "$sslDir\key.pem" -out "$sslDir\cert.pem" -days 365 -subj "/C=US/ST=State/L=City/O=Organization/CN=edu-system"

Write-Host "SSL certificates generated successfully!"