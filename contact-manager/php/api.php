<?php
require_once 'config.php';
setJsonHeader();

$conn = getConnection();
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Get input data
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

switch ($method) {
    case 'GET':
        if ($action === 'get' && isset($_GET['id'])) {
            getContact($conn, intval($_GET['id']));
        } else {
            getAllContacts($conn);
        }
        break;

    case 'POST':
        if ($action === 'add') {
            addContact($conn, $input);
        } elseif ($action === 'update') {
            updateContact($conn, $input);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            deleteContact($conn, intval($_GET['id']));
        } else {
            echo json_encode(['success' => false, 'message' => 'ID required']);
        }
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}

$conn->close();

// ========== FUNCTIONS ==========

function getAllContacts($conn) {
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    
    if ($search !== '') {
        $stmt = $conn->prepare("SELECT * FROM contacts WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? ORDER BY name ASC");
        $like = '%' . $search . '%';
        $stmt->bind_param('sss', $like, $like, $like);
    } else {
        $stmt = $conn->prepare("SELECT * FROM contacts ORDER BY name ASC");
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    $contacts = [];
    
    while ($row = $result->fetch_assoc()) {
        $contacts[] = $row;
    }
    
    echo json_encode(['success' => true, 'data' => $contacts]);
    $stmt->close();
}

function getContact($conn, $id) {
    $stmt = $conn->prepare("SELECT * FROM contacts WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        echo json_encode(['success' => true, 'data' => $row]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Contact not found']);
    }
    $stmt->close();
}

function addContact($conn, $data) {
    $name    = trim($data['name'] ?? '');
    $email   = trim($data['email'] ?? '');
    $phone   = trim($data['phone'] ?? '');
    $address = trim($data['address'] ?? '');
    $notes   = trim($data['notes'] ?? '');

    // Validation
    if (empty($name) || empty($email) || empty($phone)) {
        echo json_encode(['success' => false, 'message' => 'Name, Email and Phone are required']);
        return;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        return;
    }

    $stmt = $conn->prepare("INSERT INTO contacts (name, email, phone, address, notes) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param('sssss', $name, $email, $phone, $address, $notes);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true, 
            'message' => 'Contact added successfully',
            'id' => $conn->insert_id
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add contact: ' . $stmt->error]);
    }
    $stmt->close();
}

function updateContact($conn, $data) {
    $id      = intval($data['id'] ?? 0);
    $name    = trim($data['name'] ?? '');
    $email   = trim($data['email'] ?? '');
    $phone   = trim($data['phone'] ?? '');
    $address = trim($data['address'] ?? '');
    $notes   = trim($data['notes'] ?? '');

    if ($id <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid contact ID']);
        return;
    }
    
    if (empty($name) || empty($email) || empty($phone)) {
        echo json_encode(['success' => false, 'message' => 'Name, Email and Phone are required']);
        return;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        return;
    }

    $stmt = $conn->prepare("UPDATE contacts SET name=?, email=?, phone=?, address=?, notes=? WHERE id=?");
    $stmt->bind_param('sssssi', $name, $email, $phone, $address, $notes, $id);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Contact updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Contact not found or no changes made']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update contact: ' . $stmt->error]);
    }
    $stmt->close();
}

function deleteContact($conn, $id) {
    if ($id <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid contact ID']);
        return;
    }

    $stmt = $conn->prepare("DELETE FROM contacts WHERE id = ?");
    $stmt->bind_param('i', $id);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Contact deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Contact not found']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete contact']);
    }
    $stmt->close();
}
?>