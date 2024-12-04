<?php
require_once 'config.php';

// Add CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

header('Content-Type: application/json');

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

try {
    // Validate required fields
    $required_fields = ['product_code', 'size', 'customer_name', 'phone', 'address', 'total_price'];
    foreach ($required_fields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            throw new Exception("Field $field is required");
        }
    }

    // Insert order into database
    $sql = "INSERT INTO orders (product_code, size, customer_name, phone, address, total_price, order_date) 
            VALUES (:product_code, :size, :customer_name, :phone, :address, :total_price, NOW())";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':product_code' => $data['product_code'],
        ':size' => $data['size'],
        ':customer_name' => $data['customer_name'],
        ':phone' => $data['phone'],
        ':address' => $data['address'],
        ':total_price' => $data['total_price']
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Order berhasil disimpan'
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?> 