<?php
namespace App\Controllers;
use App\Models\tasksModel;
use CodeIgniter\Controller;
use \Firebase\JWT\JWT;
use App\Controllers\userAuth;
class tasks extends Controller{
  private $tasksModel;
  function __construct(){
  header('Access-Control-Allow-Origin:' . $_SERVER['angularHost']);
    header('Access-Control-Allow-Credentials: true');
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, authorization");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    $this->tasksModel = new tasksModel();
  }
  function read(){
    $token = $_COOKIE['Token'];
    $userAuth = new userAuth();
    if($userAuth->verifyToken($token)){
      $decodedArray = JWT::decode($token,$_SERVER['tokenKey'],array('HS256'));
      $id = $decodedArray->id;
      echo json_encode($this->tasksModel->readTask($id));
    }
  }
  function create(){
    $token = $_COOKIE['Token'];
    $userAuth = new userAuth();
    if($userAuth->verifyToken($token)){
      $decodedToken = JWT::decode($token,$_SERVER['tokenKey'],array('HS256'));
      $data = array(
        "list_id" => $this->request->getVar('list_id'),
        "user_id" => $decodedToken->id,
        "name" => $this->request->getVar('name'),
        "importance" => $this->request->getVar('importance'),
        "completed" => $this->request->getVar('completed'),
      );
      $this->response->setStatusCode(200);
      echo $this->tasksModel->createTask($data);
    }
    else{
      $this->response->setStatusCode(401);
    }
  }
  function update(){
    $token = $_COOKIE['Token'];
    $userAuth = new userAuth();
    if($userAuth->verifyToken($token)){
      $decodedToken = JWT::decode($token,$_SERVER['tokenKey'],array('HS256'));
      $data = array(
        "id" => $this->request->getRawInput()['id'],
        "user_id" => $decodedToken->id,
        "name" => $this->request->getRawInput()['name'],
        "importance" => $this->request->getRawInput()['importance'],
        "completed" => $this->request->getRawInput()['completed'],
      );
      $this->tasksModel->updateTask($data);
      $this->response->setStatusCode(200);
    }
    else{
      $this->response->setStatusCode(401);
    }
  }
  function remove($id){
    $token = $_COOKIE['Token'];
    $userAuth = new userAuth();
    if($userAuth->verifyToken($token)){
      $decodedToken = JWT::decode($token,$_SERVER['tokenKey'],array('HS256'));
      $data = array(
        "id" => $id,
        "user_id" => $decodedToken->id,
      );
      $this->response->setStatusCode(200);
      $this->tasksModel->deleteTask($data);
    }
    else{
      $this->response->setStatusCode(401);
    }
  }
}
?>
