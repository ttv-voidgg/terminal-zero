// This file provides level data and services for the terminal game

// Define the structure of a level
interface Level {
  id: number
  title: string
  description: string
  track: string
  objectives: string[]
  hints: string[]
  commands?: string[]
  successCondition: string
}

// Get the current level (in a real app, this would be stored in a database or localStorage)
export function getCurrentLevel(): number {
  // For demo purposes, return level 1
  return 1
}

// Get level data for a specific level
export function getLevelData(level: number): Level {
  // Define all levels
  const levels: Record<number, Level> = {
    1: {
      id: 1,
      title: "First Steps",
      description: "Welcome to Terminal Zero! Let's start with the basics. Your first task is to read a file.",
      track: "Terminal Basics",
      objectives: ["Use the 'cat' command to read the contents of 'secret.txt'"],
      hints: ["Type 'cat secret.txt' to display the contents of the file"],
      commands: ["help", "ls", "cat", "clear"],
      successCondition: "Read the contents of secret.txt",
    },
    2: {
      id: 2,
      title: "Hidden Files",
      description:
        "Files that start with a dot (.) are hidden by default. Your task is to find and read a hidden file.",
      track: "Terminal Basics",
      objectives: ["List all files including hidden ones", "Read the contents of the hidden file"],
      hints: [
        "Use 'ls -a' to show all files including hidden ones",
        "Hidden files start with a dot (.)",
        "Use 'cat' to read the file once you find it",
      ],
      commands: ["help", "ls", "cat", "clear"],
      successCondition: "Read the contents of the hidden .config file",
    },
    3: {
      id: 3,
      title: "File Permissions",
      description:
        "Files have permissions that control who can read, write, or execute them. Your task is to change permissions on a file.",
      track: "Terminal Basics",
      objectives: ["Change the permissions of 'locked.txt' to make it readable", "Read the contents of the file"],
      hints: [
        "Use 'chmod +r locked.txt' to add read permissions",
        "Alternatively, use 'chmod 644 locked.txt'",
        "Then use 'cat locked.txt' to read it",
      ],
      commands: ["help", "ls", "cat", "chmod", "clear"],
      successCondition: "Change permissions and read locked.txt",
    },
    4: {
      id: 4,
      title: "Executable Files",
      description:
        "Scripts need to be executable before they can be run. Your task is to make a script executable and run it.",
      track: "Terminal Basics",
      objectives: ["Make 'script.sh' executable", "Run the script"],
      hints: ["Use 'chmod +x script.sh' to make the script executable", "Run the script with './script.sh'"],
      commands: ["help", "ls", "cat", "chmod", "clear", "./script.sh"],
      successCondition: "Make script.sh executable and run it",
    },
    5: {
      id: 5,
      title: "Archives",
      description:
        "Files are often compressed into archives for storage or transfer. Your task is to extract an archive.",
      track: "Terminal Basics",
      objectives: ["Extract the contents of 'backup.tar.gz'", "Read the extracted file"],
      hints: [
        "Use 'tar -xzf backup.tar.gz' to extract the archive",
        "The -x flag extracts, -z handles gzip compression, and -f specifies the file",
        "After extraction, use 'cat' to read any extracted files",
      ],
      commands: ["help", "ls", "cat", "tar", "clear"],
      successCondition: "Extract backup.tar.gz and read its contents",
    },
    6: {
      id: 6,
      title: "Finding Files",
      description:
        "When you don't know where a file is located, you can search for it. Your task is to find and read a hidden file somewhere in the system.",
      track: "Terminal Basics",
      objectives: ["Find a file named 'secret_file.txt'", "Read its contents"],
      hints: [
        "Use 'find / -name secret_file.txt' to search for the file",
        "The '/' tells find to start from the root directory",
        "Once found, use 'cat' to read the file",
      ],
      commands: ["help", "ls", "cat", "find", "clear"],
      successCondition: "Find and read secret_file.txt",
    },
    7: {
      id: 7,
      title: "Searching in Files",
      description:
        "Sometimes you need to find specific content within files. Your task is to find a password in log files.",
      track: "Terminal Basics",
      objectives: ["Search for the word 'password' in all text files", "Find the actual password"],
      hints: [
        "Use 'grep password *.txt' to search for 'password' in all text files",
        "Look carefully at the results to find the actual password",
      ],
      commands: ["help", "ls", "cat", "grep", "clear"],
      successCondition: "Find the password in the log files",
    },
    8: {
      id: 8,
      title: "Command Chaining",
      description:
        "Commands can be chained together using pipes (|) to process data. Your task is to count the number of files in a directory.",
      track: "Terminal Basics",
      objectives: ["List all files in the directory", "Count the number of files"],
      hints: ["Use 'ls' to list files", "Use 'wc -l' to count lines", "Chain them with a pipe: ls | wc -l"],
      commands: ["help", "ls", "wc", "clear"],
      successCondition: "Count the number of files in the directory",
    },
    9: {
      id: 9,
      title: "Environment Variables",
      description:
        "Environment variables store information that can be used by commands and scripts. Your task is to find a secret stored in an environment variable.",
      track: "Terminal Basics",
      objectives: ["Display all environment variables", "Find the secret variable"],
      hints: ["Use 'env' to display all environment variables", "Look for a variable named 'SECRET'"],
      commands: ["help", "ls", "cat", "env", "clear"],
      successCondition: "Find the SECRET environment variable",
    },
    10: {
      id: 10,
      title: "Debugging Code",
      description: "Programmers often need to fix bugs in code. Your task is to fix a broken JavaScript function.",
      track: "Terminal Basics",
      objectives: ["Edit script.js to fix the add function", "Run the script to verify it works"],
      hints: [
        "Use 'sudo edit script.js' to edit the file",
        "The function should return a + b, not a - b",
        "After fixing, run with 'node script.js'",
      ],
      commands: ["help", "ls", "cat", "sudo", "nano", "node", "clear"],
      successCondition: "Fix the add function and run the script",
    },
    11: {
      id: 11,
      title: "JavaScript Arrays",
      description:
        "Learn to manipulate arrays in JavaScript. Your task is to fix a script that should reverse an array.",
      track: "Programming Logic",
      objectives: ["Edit array.js to use the array.reverse() method", "Run the script to verify it works"],
      hints: [
        "Use 'sudo edit array.js' to edit the file",
        "Find the line where you need to reverse the array",
        "Use the array.reverse() method to reverse the array",
        "After fixing, run with 'node array.js'",
      ],
      commands: ["help", "ls", "cat", "sudo", "edit", "node", "clear"],
      successCondition: "Fix the array reversal and run the script",
    },
    12: {
      id: 12,
      title: "JSON Parsing",
      description: "Parse a JSON file to extract sensitive information.",
      track: "Programming Logic",
      objectives: ["Write code to parse data.json", "Extract the admin password"],
      hints: [
        "Use 'cat data.json' to view the JSON data",
        "Create a script that uses JSON.parse()",
        "Look for the admin user in the users array",
        "Run your script with 'node parse.js'",
      ],
      commands: ["help", "ls", "cat", "node", "clear", "nano"],
      successCondition: "Extract the admin password from data.json",
    },
    13: {
      id: 13,
      title: "Regular Expressions",
      description: "Use regular expressions to extract information from text.",
      track: "Programming Logic",
      objectives: ["Extract an email address and phone number from text"],
      hints: [
        "Use 'cat text.txt' to view the text",
        "Create a regex for email addresses like /\\w+@\\w+\\.\\w+/",
        "Create a regex for phone numbers like /\\d{3}-\\d{3}-\\d{4}/",
        "Use 'extract' or 'regex' command with the patterns",
      ],
      commands: ["help", "ls", "cat", "extract", "regex", "clear", "nano", "node"],
      successCondition: "Extract both the email and phone number",
    },
    14: {
      id: 14,
      title: "Loops",
      description: "Create a loop that prints numbers from 1 to 10.",
      track: "Programming Logic",
      objectives: ["Create a JavaScript file with a loop", "Run the script to print numbers 1-10"],
      hints: [
        "Use a for loop: for(let i=1; i<=10; i++)",
        "Print each number with console.log(i)",
        "Save your code in loop.js",
        "Run with 'node loop.js'",
      ],
      commands: ["help", "ls", "cat", "node", "clear", "nano"],
      successCondition: "Create and run a loop that prints 1-10",
    },
    15: {
      id: 15,
      title: "Python Debugging",
      description: "Fix a broken Python script that should print 'Hello'.",
      track: "Programming Logic",
      objectives: ["Fix the syntax error in broken.py", "Run the script to verify it works"],
      hints: [
        "Use 'cat broken.py' to view the code",
        "Look for missing colons, incorrect indentation, or mismatched quotes",
        "After fixing, run with 'python broken.py'",
      ],
      commands: ["help", "ls", "cat", "python", "clear", "nano"],
      successCondition: "Fix and run broken.py",
    },
    16: {
      id: 16,
      title: "Array Sorting",
      description: "Create a script that sorts an array of numbers.",
      track: "Programming Logic",
      objectives: ["Create a JavaScript file that sorts an array", "Run the script to verify it works"],
      hints: [
        "Create an array: const arr = [5, 3, 8, 1, 2, 4]",
        "Use the sort method with a compare function",
        "Save your code in sort.js",
        "Run with 'node sort.js'",
      ],
      commands: ["help", "ls", "cat", "node", "clear", "nano"],
      successCondition: "Create and run a script that sorts an array",
    },
    17: {
      id: 17,
      title: "Array Filtering",
      description: "Create a script that filters an array to get only odd numbers.",
      track: "Programming Logic",
      objectives: ["Create a JavaScript file that filters an array", "Run the script to verify it works"],
      hints: [
        "Create an array: const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]",
        "Use the filter method to keep only odd numbers",
        "Save your code in filter.js",
        "Run with 'node filter.js'",
      ],
      commands: ["help", "ls", "cat", "node", "clear", "nano"],
      successCondition: "Create and run a script that filters an array",
    },
    18: {
      id: 18,
      title: "Base64 Decoding",
      description: "Create a script that decodes a Base64 encoded string.",
      track: "Programming Logic",
      objectives: ["Create a JavaScript file that decodes a Base64 string", "Run the script to verify it works"],
      hints: [
        "Use Buffer.from(encodedString, 'base64').toString() to decode",
        "The encoded string is: SGVsbG8gSGFja2VyIQ==",
        "Save your code in decode.js",
        "Run with 'node decode.js'",
      ],
      commands: ["help", "ls", "cat", "node", "clear", "nano"],
      successCondition: "Create and run a script that decodes a Base64 string",
    },
    19: {
      id: 19,
      title: "API Payload Modification",
      description: "Modify a JSON payload to gain admin privileges.",
      track: "Web Hacking",
      objectives: ["Modify a JSON payload to add admin privileges", "Submit the modified payload"],
      hints: [
        'The original payload is: {"username":"admin","password":"REDACTED"}',
        "Add an 'admin' field set to true",
        "Use the 'modify' command to submit your payload",
      ],
      commands: ["help", "ls", "cat", "modify", "clear"],
      successCondition: "Modify the JSON payload to gain admin privileges",
    },
    20: {
      id: 20,
      title: "Password Cracking",
      description: "Create a script that identifies a password from its MD5 hash.",
      track: "Cryptography",
      objectives: [
        "Create a JavaScript file that identifies a password from its hash",
        "Run the script to verify it works",
      ],
      hints: [
        "The MD5 hash is: 5f4dcc3b5aa765d61d8327deb882cf99",
        "This is a common password",
        "Save your code in hash.js",
        "Run with 'node hash.js'",
      ],
      commands: ["help", "ls", "cat", "node", "clear", "nano"],
      successCondition: "Create and run a script that identifies a password from its hash",
    },
    21: {
      id: 21,
      title: "HTTP Requests",
      description: "Make an HTTP request to a web server.",
      track: "Web Hacking",
      objectives: ["Use curl to make an HTTP request to example.com"],
      hints: ["Use 'curl example.com' to make a GET request", "Examine the response to see the HTML content"],
      commands: ["help", "ls", "cat", "curl", "clear"],
      successCondition: "Make an HTTP request to example.com",
    },
    22: {
      id: 22,
      title: "Cookie Analysis",
      description: "Analyze a cookie to understand its purpose.",
      track: "Web Hacking",
      objectives: ["Analyze a session cookie", "Identify its purpose"],
      hints: [
        "Use the 'analyze' command with 'cookie' and 'session' parameters",
        "Look for patterns in the cookie value",
      ],
      commands: ["help", "ls", "cat", "analyze", "clear"],
      successCondition: "Analyze the session cookie",
    },
    23: {
      id: 23,
      title: "HTTP POST Requests",
      description: "Send a POST request to a login endpoint.",
      track: "Web Hacking",
      objectives: ["Use curl to send a POST request to /login"],
      hints: [
        "Use 'curl -X POST /login' to send a POST request",
        "Examine the response to see the redirect and cookie",
      ],
      commands: ["help", "ls", "cat", "curl", "clear"],
      successCondition: "Send a POST request to /login",
    },
    24: {
      id: 24,
      title: "Cookie Manipulation",
      description: "Modify a cookie to escalate privileges.",
      track: "Web Hacking",
      objectives: ["Decode a cookie", "Modify it to gain admin access", "Encode it again"],
      hints: [
        'The cookie contains JSON: {"user":"guest"}',
        "Change 'guest' to 'admin'",
        "Use the 'decode' command with 'admin' parameter",
      ],
      commands: ["help", "ls", "cat", "decode", "clear"],
      successCondition: "Modify the cookie to gain admin access",
    },
    25: {
      id: 25,
      title: "SQL Injection",
      description: "Exploit a SQL injection vulnerability to bypass authentication.",
      track: "Web Hacking",
      objectives: ["Craft a SQL injection payload", "Bypass authentication"],
      hints: [
        "The login query is: SELECT * FROM users WHERE username = '[INPUT]' AND password = '[INPUT]'",
        "Use the classic OR 1=1 technique",
        "Try: ' OR '1'='1",
        "Use the 'inject' command with your payload",
      ],
      commands: ["help", "ls", "cat", "inject", "clear"],
      successCondition: "Bypass authentication with SQL injection",
    },
    26: {
      id: 26,
      title: "Cross-Site Scripting (XSS)",
      description: "Exploit an XSS vulnerability to execute JavaScript in a browser.",
      track: "Web Hacking",
      objectives: ["Craft an XSS payload", "Execute JavaScript in the browser"],
      hints: [
        "The input is directly inserted into: <div>Welcome, <!--INPUT--></div>",
        "Try a simple script tag: <script>alert('XSS')</script>",
        "Use the 'inject' command with your payload",
      ],
      commands: ["help", "ls", "cat", "inject", "clear"],
      successCondition: "Execute JavaScript with XSS",
    },
    27: {
      id: 27,
      title: "API Authentication",
      description: "Send an authenticated request to an API using a Bearer token.",
      track: "Web Hacking",
      objectives: ["Send a request with a Bearer token in the Authorization header"],
      hints: [
        "Use 'curl' with the '-H' flag to add headers",
        "The header should be: Authorization: Bearer [token]",
        "Any token value will work for this exercise",
      ],
      commands: ["help", "ls", "cat", "curl", "clear"],
      successCondition: "Send an authenticated request with a Bearer token",
    },
    28: {
      id: 28,
      title: "CORS Analysis",
      description: "Analyze CORS headers to identify security risks.",
      track: "Web Hacking",
      objectives: ["Analyze CORS headers", "Identify security risks"],
      hints: [
        "The server has the header: Access-Control-Allow-Origin: *",
        "This allows any website to make cross-origin requests",
        "Use the 'analyze' command with 'CORS' parameter",
      ],
      commands: ["help", "ls", "cat", "analyze", "clear"],
      successCondition: "Analyze CORS headers and identify risks",
    },
    29: {
      id: 29,
      title: "JWT Tampering",
      description: "Modify a JWT to escalate privileges.",
      track: "Web Hacking",
      objectives: ["Decode a JWT", "Modify it to gain admin access", "Encode it again"],
      hints: [
        'The JWT payload contains: {"user":"guest","role":"user"}',
        "Change 'role' to 'admin'",
        "Use the 'decode' command with 'admin' parameter",
      ],
      commands: ["help", "ls", "cat", "decode", "clear"],
      successCondition: "Modify the JWT to gain admin access",
    },
    30: {
      id: 30,
      title: "Client-Side Bypass",
      description: "Bypass client-side security controls to access an admin panel.",
      track: "Web Hacking",
      objectives: ["Identify client-side security controls", "Bypass them to access the admin panel"],
      hints: [
        "The admin panel is hidden with CSS: display:none",
        "This can be bypassed by modifying the DOM",
        "Use the 'bypass' command with 'admin' parameter",
      ],
      commands: ["help", "ls", "cat", "bypass", "clear"],
      successCondition: "Bypass client-side controls to access the admin panel",
    },
    // Networking Track (31-40)
    31: {
      id: 31,
      title: "Network Scanning",
      description: "Scan a network to discover hosts and open ports.",
      track: "Networking",
      objectives: ["Scan a network range", "Identify hosts and open ports"],
      hints: ["Use 'nmap' to scan a network", "The target network is 192.168.1.0/24", "Look for hosts with open ports"],
      commands: ["help", "ls", "cat", "nmap", "clear"],
      successCondition: "Scan a network and identify hosts",
    },
    32: {
      id: 32,
      title: "Packet Analysis",
      description: "Analyze network packets to identify suspicious traffic.",
      track: "Networking",
      objectives: ["Analyze packet captures", "Identify suspicious traffic"],
      hints: [
        "Use 'tcpdump' to analyze packets",
        "Look for unusual port numbers or protocols",
        "Filter for specific traffic types",
      ],
      commands: ["help", "ls", "cat", "tcpdump", "clear"],
      successCondition: "Analyze packets and identify suspicious traffic",
    },
    33: {
      id: 33,
      title: "DNS Enumeration",
      description: "Enumerate DNS records to gather information about a domain.",
      track: "Networking",
      objectives: ["Query DNS records", "Gather information about a domain"],
      hints: [
        "Use 'dig' or 'nslookup' to query DNS records",
        "Look for A, MX, NS, and TXT records",
        "The target domain is example.com",
      ],
      commands: ["help", "ls", "cat", "dig", "nslookup", "clear"],
      successCondition: "Enumerate DNS records for a domain",
    },
    34: {
      id: 34,
      title: "ARP Spoofing",
      description: "Perform an ARP spoofing attack to intercept network traffic.",
      track: "Networking",
      objectives: ["Configure ARP spoofing", "Intercept traffic between two hosts"],
      hints: [
        "Use 'arpspoof' to perform the attack",
        "Target IP addresses are 192.168.1.1 and 192.168.1.2",
        "Enable IP forwarding to avoid disrupting traffic",
      ],
      commands: ["help", "ls", "cat", "arpspoof", "clear"],
      successCondition: "Perform ARP spoofing to intercept traffic",
    },
    35: {
      id: 35,
      title: "Firewall Configuration",
      description: "Configure a firewall to allow specific traffic and block the rest.",
      track: "Networking",
      objectives: ["Configure firewall rules", "Allow specific traffic and block the rest"],
      hints: [
        "Use 'iptables' to configure the firewall",
        "Allow SSH (port 22) and HTTP (port 80)",
        "Block all other incoming traffic",
      ],
      commands: ["help", "ls", "cat", "iptables", "clear"],
      successCondition: "Configure firewall rules correctly",
    },
    36: {
      id: 36,
      title: "Network Monitoring",
      description: "Set up network monitoring to detect unusual traffic patterns.",
      track: "Networking",
      objectives: ["Configure network monitoring", "Detect unusual traffic patterns"],
      hints: [
        "Use 'netstat' to monitor network connections",
        "Look for connections to unusual ports",
        "Set up alerts for suspicious activity",
      ],
      commands: ["help", "ls", "cat", "netstat", "clear"],
      successCondition: "Set up network monitoring and detect unusual traffic",
    },
    37: {
      id: 37,
      title: "VPN Configuration",
      description: "Configure a VPN to secure network traffic.",
      track: "Networking",
      objectives: ["Set up a VPN server", "Configure a VPN client", "Test the connection"],
      hints: [
        "Use OpenVPN for the VPN server",
        "Configure the client with the server's certificate",
        "Test the connection by accessing a resource through the VPN",
      ],
      commands: ["help", "ls", "cat", "openvpn", "clear"],
      successCondition: "Configure a VPN and test the connection",
    },
    38: {
      id: 38,
      title: "SSH Configuration",
      description: "Configure SSH for secure remote access.",
      track: "Networking",
      objectives: ["Set up SSH key-based authentication", "Connect to a remote server"],
      hints: [
        "Generate SSH keys with ssh-keygen",
        "Copy the public key to the server",
        "Connect using 'ssh -i key.pem admin@192.168.1.100'",
      ],
      commands: ["help", "ls", "cat", "ssh", "ssh-keygen", "clear"],
      successCondition: "Configure SSH and connect to a remote server",
    },
    39: {
      id: 39,
      title: "Network Traffic Analysis",
      description: "Analyze network traffic to identify data exfiltration.",
      track: "Networking",
      objectives: ["Analyze network traffic", "Identify data exfiltration"],
      hints: [
        "Use 'wireshark' or 'tcpdump' to capture traffic",
        "Look for large outbound transfers",
        "Check for unusual destinations or protocols",
      ],
      commands: ["help", "ls", "cat", "wireshark", "tcpdump", "clear"],
      successCondition: "Analyze traffic and identify data exfiltration",
    },
    40: {
      id: 40,
      title: "Network Segmentation",
      description: "Implement network segmentation to improve security.",
      track: "Networking",
      objectives: ["Design a segmented network", "Implement access controls between segments"],
      hints: [
        "Create separate VLANs for different departments",
        "Configure firewall rules between segments",
        "Implement least privilege access controls",
      ],
      commands: ["help", "ls", "cat", "vlan", "iptables", "clear"],
      successCondition: "Implement network segmentation and access controls",
    },
    // Cryptography Track (41-50)
    41: {
      id: 41,
      title: "Symmetric Encryption",
      description: "Use symmetric encryption to secure sensitive data.",
      track: "Cryptography",
      objectives: ["Encrypt data with AES", "Decrypt the encrypted data"],
      hints: ["Use OpenSSL for encryption", "Generate a secure key", "Encrypt and decrypt a test message"],
      commands: ["help", "ls", "cat", "openssl", "clear"],
      successCondition: "Encrypt and decrypt data with AES",
    },
    42: {
      id: 42,
      title: "Asymmetric Encryption",
      description: "Use asymmetric encryption for secure communication.",
      track: "Cryptography",
      objectives: ["Generate RSA key pair", "Encrypt with public key", "Decrypt with private key"],
      hints: [
        "Use OpenSSL to generate RSA keys",
        "Encrypt a message with the public key",
        "Decrypt the message with the private key",
      ],
      commands: ["help", "ls", "cat", "openssl", "clear"],
      successCondition: "Use asymmetric encryption for secure communication",
    },
    43: {
      id: 43,
      title: "Digital Signatures",
      description: "Create and verify digital signatures to ensure data integrity.",
      track: "Cryptography",
      objectives: ["Create a digital signature", "Verify the signature"],
      hints: [
        "Use OpenSSL to create a signature",
        "Sign a document with a private key",
        "Verify the signature with the public key",
      ],
      commands: ["help", "ls", "cat", "openssl", "clear"],
      successCondition: "Create and verify digital signatures",
    },
    44: {
      id: 44,
      title: "Hash Functions",
      description: "Use hash functions to verify data integrity.",
      track: "Cryptography",
      objectives: ["Calculate file hashes", "Verify file integrity"],
      hints: ["Use 'sha256sum' to calculate hashes", "Compare hashes to verify integrity", "Check for hash collisions"],
      commands: ["help", "ls", "cat", "sha256sum", "clear"],
      successCondition: "Calculate and verify file hashes",
    },
    45: {
      id: 45,
      title: "Password Hashing",
      description: "Implement secure password hashing to protect user credentials.",
      track: "Cryptography",
      objectives: ["Hash passwords securely", "Verify password hashes"],
      hints: [
        "Use bcrypt or Argon2 for password hashing",
        "Include a salt to prevent rainbow table attacks",
        "Verify passwords by comparing hashes",
      ],
      commands: ["help", "ls", "cat", "node", "clear"],
      successCondition: "Implement secure password hashing",
    },
    46: {
      id: 46,
      title: "Certificate Authority",
      description: "Set up a Certificate Authority (CA) to issue digital certificates.",
      track: "Cryptography",
      objectives: ["Create a root CA", "Issue certificates", "Verify certificates"],
      hints: ["Use OpenSSL to create a root CA", "Issue certificates signed by the CA", "Verify certificate chains"],
      commands: ["help", "ls", "cat", "openssl", "clear"],
      successCondition: "Set up a CA and issue certificates",
    },
    47: {
      id: 47,
      title: "Secure Key Exchange",
      description: "Implement Diffie-Hellman key exchange for secure communication.",
      track: "Cryptography",
      objectives: ["Generate Diffie-Hellman parameters", "Exchange keys securely"],
      hints: ["Use OpenSSL to generate DH parameters", "Exchange public keys", "Derive a shared secret"],
      commands: ["help", "ls", "cat", "openssl", "clear"],
      successCondition: "Implement Diffie-Hellman key exchange",
    },
    48: {
      id: 48,
      title: "Encrypted Communication",
      description: "Set up encrypted communication between two hosts.",
      track: "Cryptography",
      objectives: ["Configure TLS/SSL", "Test encrypted communication"],
      hints: ["Generate certificates for both hosts", "Configure TLS/SSL settings", "Test the encrypted connection"],
      commands: ["help", "ls", "cat", "openssl", "curl", "clear"],
      successCondition: "Set up and test encrypted communication",
    },
    49: {
      id: 49,
      title: "Cryptographic Attacks",
      description: "Understand and mitigate common cryptographic attacks.",
      track: "Cryptography",
      objectives: ["Identify vulnerable cryptographic implementations", "Implement mitigations"],
      hints: [
        "Look for weak algorithms (MD5, SHA1)",
        "Check for padding oracle vulnerabilities",
        "Implement secure algorithms and protocols",
      ],
      commands: ["help", "ls", "cat", "analyze", "clear"],
      successCondition: "Identify and mitigate cryptographic vulnerabilities",
    },
    50: {
      id: 50,
      title: "Secure Random Number Generation",
      description: "Implement secure random number generation for cryptographic operations.",
      track: "Cryptography",
      objectives: ["Generate cryptographically secure random numbers", "Test randomness"],
      hints: [
        "Use /dev/urandom or crypto.randomBytes()",
        "Avoid Math.random() for security",
        "Test the randomness of the generated numbers",
      ],
      commands: ["help", "ls", "cat", "node", "clear"],
      successCondition: "Implement secure random number generation",
    },
    // Advanced Exploits Track (51-60)
    51: {
      id: 51,
      title: "Buffer Overflow",
      description: "Exploit a buffer overflow vulnerability to execute arbitrary code.",
      track: "Advanced Exploits",
      objectives: ["Identify a buffer overflow vulnerability", "Exploit it to execute code"],
      hints: [
        "Look for unbounded input functions like gets() or strcpy()",
        "Craft an input that overflows the buffer",
        "Include shellcode to execute commands",
      ],
      commands: ["help", "ls", "cat", "exploit", "clear"],
      successCondition: "Exploit a buffer overflow vulnerability",
    },
    52: {
      id: 52,
      title: "Format String Vulnerability",
      description: "Exploit a format string vulnerability to read memory.",
      track: "Advanced Exploits",
      objectives: ["Identify a format string vulnerability", "Exploit it to read memory"],
      hints: [
        "Look for printf(user_input) without format specifiers",
        "Use %x or %p to read from the stack",
        "Chain format specifiers to read specific memory addresses",
      ],
      commands: ["help", "ls", "cat", "exploit", "clear"],
      successCondition: "Exploit a format string vulnerability",
    },
    53: {
      id: 53,
      title: "Race Condition",
      description: "Exploit a race condition to gain unauthorized access.",
      track: "Advanced Exploits",
      objectives: ["Identify a race condition", "Exploit it to gain access"],
      hints: [
        "Look for time-of-check to time-of-use (TOCTOU) bugs",
        "Create a script that exploits the timing window",
        "Execute the exploit to gain access",
      ],
      commands: ["help", "ls", "cat", "exploit", "clear"],
      successCondition: "Exploit a race condition",
    },
    54: {
      id: 54,
      title: "Command Injection",
      description: "Exploit a command injection vulnerability to execute arbitrary commands.",
      track: "Advanced Exploits",
      objectives: ["Identify a command injection vulnerability", "Execute arbitrary commands"],
      hints: [
        "Look for user input passed to system() or exec()",
        "Use metacharacters like ; | & to inject commands",
        "Execute commands to gain access or read sensitive files",
      ],
      commands: ["help", "ls", "cat", "exploit", "clear"],
      successCondition: "Exploit a command injection vulnerability",
    },
    55: {
      id: 55,
      title: "Privilege Escalation",
      description: "Escalate privileges from a regular user to root/administrator.",
      track: "Advanced Exploits",
      objectives: ["Identify privilege escalation vectors", "Escalate to root privileges"],
      hints: ["Look for SUID binaries", "Check for misconfigured sudo permissions", "Exploit kernel vulnerabilities"],
      commands: ["help", "ls", "cat", "sudo", "find", "clear"],
      successCondition: "Escalate privileges to root",
    },
    56: {
      id: 56,
      title: "Remote Code Execution",
      description: "Exploit a vulnerability to execute code on a remote system.",
      track: "Advanced Exploits",
      objectives: ["Identify a remote code execution vulnerability", "Execute code remotely"],
      hints: [
        "Look for vulnerable web applications or services",
        "Craft a payload to execute code",
        "Establish a reverse shell or command execution channel",
      ],
      commands: ["help", "ls", "cat", "exploit", "curl", "clear"],
      successCondition: "Execute code on a remote system",
    },
    57: {
      id: 57,
      title: "Binary Exploitation",
      description: "Analyze and exploit a vulnerable binary.",
      track: "Advanced Exploits",
      objectives: ["Analyze a binary for vulnerabilities", "Exploit the vulnerabilities"],
      hints: [
        "Use tools like gdb, objdump, or radare2",
        "Look for memory corruption bugs",
        "Craft an exploit to gain control of execution",
      ],
      commands: ["help", "ls", "cat", "gdb", "objdump", "clear"],
      successCondition: "Exploit a vulnerable binary",
    },
    58: {
      id: 58,
      title: "Memory Forensics",
      description: "Analyze a memory dump to find evidence of compromise.",
      track: "Advanced Exploits",
      objectives: ["Analyze a memory dump", "Find evidence of compromise"],
      hints: [
        "Use tools like Volatility",
        "Look for suspicious processes or network connections",
        "Extract credentials or malware artifacts",
      ],
      commands: ["help", "ls", "cat", "strings", "clear"],
      successCondition: "Analyze a memory dump and find evidence",
    },
    59: {
      id: 59,
      title: "Ransomware Analysis",
      description: "Analyze ransomware to understand its behavior and find the decryption key.",
      track: "Advanced Exploits",
      objectives: ["Analyze ransomware behavior", "Find the decryption key"],
      hints: [
        "Use a sandbox environment for analysis",
        "Monitor file system and registry changes",
        "Look for the decryption key in memory or environment variables",
      ],
      commands: ["help", "ls", "cat", "env", "strings", "clear"],
      successCondition: "Analyze ransomware and find the decryption key",
    },
    60: {
      id: 60,
      title: "Steganography",
      description: "Extract hidden information from files using steganography techniques.",
      track: "Advanced Exploits",
      objectives: ["Identify files with hidden information", "Extract the hidden data"],
      hints: [
        "Look for unusual patterns or metadata in files",
        "Use steganography tools to extract hidden data",
        "Check image, audio, or text files for hidden information",
      ],
      commands: ["help", "ls", "cat", "strings", "clear"],
      successCondition: "Extract hidden information from files",
    },
  }

  // Return the level data or a default if not found
  return (
    levels[level] || {
      id: level,
      title: "Unknown Level",
      description: "This level has not been implemented yet.",
      track: "Unknown",
      objectives: ["No objectives defined"],
      hints: ["No hints available"],
      commands: ["help", "ls", "cat", "clear"],
      successCondition: "Unknown",
    }
  )
}

// Get the file system for a specific level
export function getLevelFileSystem(level: number): Record<string, any> {
  // Define file systems for each level
  const fileSystems: Record<number, Record<string, any>> = {
    1: {
      "/": {
        "readme.txt": "Welcome to Terminal Zero! This is your first challenge.",
        "secret.txt": "Congratulations! You've completed level 1. The secret code is: f1rst_st3ps",
        "hint.txt": "Try using the 'cat' command to read files.",
      },
    },
    2: {
      "/": {
        "readme.txt": "Level 2: Find the hidden file.",
        ".config": "Congratulations! You've found the hidden file. The secret code is: h1dd3n_f1l3s",
        "hint.txt": "Hidden files start with a dot (.) and are not shown by default.",
      },
    },
    3: {
      "/": {
        "readme.txt": "Level 3: Change file permissions.",
        "locked.txt": "Congratulations! You've changed the permissions. The secret code is: p3rm1ss10ns",
        "hint.txt": "Use chmod to change file permissions.",
      },
    },
    4: {
      "/": {
        "readme.txt": "Level 4: Make a script executable and run it.",
        "script.sh": "#!/bin/bash\necho 'Hello, world!'\necho 'This is a bash script.'\necho 'Secret code: ex3cut4bl3'",
        "hint.txt": "Use chmod +x to make a script executable, then run it with ./script.sh",
      },
    },
    5: {
      "/": {
        "readme.txt": "Level 5: Extract an archive.",
        "backup.tar.gz": "[Archive contents]",
        "hint.txt": "Use tar -xzf to extract a .tar.gz archive.",
      },
    },
    6: {
      "/": {
        "readme.txt": "Level 6: Find a hidden file somewhere in the system.",
        "hint.txt": "Use the find command to search for files by name.",
      },
      "/hidden": {
        "secret_file.txt": "Congratulations! You've found the hidden file. The secret code is: f0und_1t",
      },
    },
    7: {
      "/": {
        "readme.txt": "Level 7: Search for a password in log files.",
        "text.txt": "This file contains the word 'password' somewhere in it.",
        "logs.txt": "2023-05-05 14:30:22 - User logged in with password: s3cretl0g",
        "hint.txt": "Use grep to search for text within files.",
      },
    },
    8: {
      "/": {
        "readme.txt": "Level 8: Chain commands to count files.",
        "file1.txt": "This is file 1",
        "file2.txt": "This is file 2",
        "file3.txt": "This is file 3",
        "file4.txt": "This is file 4",
        "file5.txt": "This is file 5",
        "hint.txt": "Use ls | wc -l to count the number of files.",
        "commands.txt": "Try using the pipe symbol (|) to chain commands together.",
      },
    },
    9: {
      "/": {
        "readme.txt": "Level 9: Find a secret environment variable.",
        "hint.txt": "Use the env command to display environment variables.",
      },
    },
    10: {
      "/": {
        "readme.txt": "Level 10: Fix a broken JavaScript function.",
        "script.js":
          "function add(a, b) {\n  return a - b; // This is wrong, should be a + b\n}\n\nconsole.log(add(5, 3)); // Should output 8, but currently outputs 2",
        "hint.txt": "Use sudo nano script.js to edit the file. The add function should add numbers, not subtract them.",
      },
    },
    11: {
      "/": {
        "readme.txt": "Level 11: JavaScript Arrays. Edit array.js to reverse the array.",
        "array.js":
          "// JavaScript Array Manipulation\n\n// This script should reverse an array\nconst numbers = [1, 2, 3, 4, 5];\n\nconsole.log('Original array:', numbers);\n\n// TODO: Add code to reverse the array\n// Hint: Use the array.reverse() method\n\nconsole.log('Reversed array:', numbers);",
        "hint.txt": "Use the array.reverse() method to reverse the array in place.",
      },
    },
    12: {
      "/": {
        "readme.txt": "Level 12: Parse JSON data.",
        "data.json":
          '{\n  "users": [\n    {"username": "guest", "password": "guest123"},\n    {"username": "admin", "password": "s3cur3!"}\n  ]\n}',
        "hint.txt": "Create a script to parse the JSON and extract the admin password.",
        "parse.js":
          "// JavaScript JSON Parsing\n\n// This script should parse data.json and extract the admin password\nconst fs = require('fs');\n\n// TODO: Add code to read and parse data.json\n// Hint: Use fs.readFileSync and JSON.parse\n\n// TODO: Find the admin user and extract the password\n// Hint: Loop through the users array or use find()\n\nconsole.log('Admin password: '); // Add the password after this",
      },
    },
    13: {
      "/": {
        "readme.txt": "Level 13: Extract patterns using regular expressions.",
        "text.txt": "Contact our admin at admin@example.com or call 555-123-4567 for support.",
        "hint.txt": "Create a script that uses regular expressions to extract the email and phone number.",
      },
    },
    // Add more file systems for other levels
  }

  // Return the file system for the level or a default if not found
  return (
    fileSystems[level] || {
      "/": {
        "readme.txt": "This level has not been implemented yet.",
      },
    }
  )
}

// Update level file system (for adding extracted files)
export function updateLevelFileSystem(level: number, path: string, filename: string, content: string): void {
  // This function would update the file system in a real implementation
  // For now, we'll just log the action
  console.log(`Updated file system for level ${level}: Added ${filename} to ${path} with content: ${content}`)
}

// Get all tracks
export function getAllTracks(): string[] {
  return ["Terminal Basics", "Programming Logic", "Web Hacking", "Networking", "Cryptography", "Advanced Exploits"]
}

// Get levels by track
export function getLevelsByTrack(track: string): Level[] {
  const levels: Level[] = []

  // For each possible level (1-60), check if it belongs to the track
  for (let i = 1; i <= 60; i++) {
    const level = getLevelData(i)
    if (level.track === track) {
      levels.push(level)
    }
  }

  return levels
}
