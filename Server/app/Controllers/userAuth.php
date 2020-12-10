<?php
namespace App\Controllers;
use \Firebase\JWT\JWT;
use App\Models\usersModel;
use CodeIgniter\Controller;
class userAuth extends Controller{
  function __construct(){
    header('Access-Control-Allow-Origin:' . $_SERVER['angularHost']);
    header('Access-Control-Allow-Credentials: true');
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    helper('cookie');
  }
  public function Login(){
    $error;
    $usersModel = new usersModel();
    $email = $this->request->getVar('email');
    $password = $this->request->getVar('password');
    $result = $usersModel->findUser($email);
    $success;
    if(!empty($result)){
      if(password_verify($password,$result['password'])){
        $exp = time() + (30 * 24 * 60 * 60);
        $token = $this->createJwt($result, $exp);
      setcookie("Token", $token, array(
        'expires' => $exp,
        'path' => '/',
        'domain' => '', // leading dot for compatibility or use subdomain
        'secure' => false,     // or false
        'httponly' => true,    // or false
        'samesite' => 'Lax'
      ));


      $this->response->setStatusCode('200');
      return;
    }
    else{
      $this->response->setStatusCode('401');
    }
  }
  else{
    $this->response->setStatusCode('404');
  }
}
function isLogged(){
  $this->response->setStatusCode('200');
  if(isset($_COOKIE['Token'])){
    $token = $_COOKIE['Token'];
    if(isset($token) && !empty($token)){
      if($this->verifyToken($token)){
        echo json_encode(array(
          "valid" => true,
        ));
      }
      else{
        echo json_encode(array(
          "valid" => false,
        ));
      }
    }
    else{
      echo json_encode(array(
        "valid" => false,
      ));
    }
  }
  else{
    echo json_encode(array(
      "valid" => false,
    ));
  }
}
function verifyToken($token){
  $key = $_SERVER['tokenKey'] ;
  if($token){
    try{
      $token = JWT::decode($token,$key,array('HS256'));
      return true;
    }
    catch (\Exception $e){
      return false;
    }
  }
  else{
    return false;

  }
}

function createJwt($result, $exp = null){
  $payload = array(
    'id' => $result['id'],
    "exp" => $exp,
  );
  $key = $_SERVER['tokenKey'];

  $jwt = JWT::encode($payload,$key,'HS256');
  return $jwt;
}
}
?>
