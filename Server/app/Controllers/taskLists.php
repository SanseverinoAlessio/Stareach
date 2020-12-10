<?php
namespace App\Controllers;
use CodeIgniter\Controller;
use App\Models\listsModel;
use App\Controllers\userAuth;
use \Firebase\JWT\JWT;
use App\Models\tasksModel;
class taskLists extends Controller{
  public function __construct()
  {
    header('Access-Control-Allow-Origin:' . $_SERVER['angularHost']);
    header('Access-Control-Allow-Credentials: true');
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == "OPTIONS") {
      die();
    }
  }
  function read(){
    $token = $_COOKIE['Token'];
    $userAuth = new userAuth();
    if($userAuth->verifyToken($token)){
      $decodedArray = JWT::decode($token,$_SERVER['tokenKey'],array('HS256'));
      $id = $decodedArray->id;
      $listsModel= new listsModel();
      $this->response->setStatusCode(200);
      echo json_encode($listsModel->readList($id));
    }
    else{
      $this->response->setStatusCode(401);
      return;
    }
  }
  function create(){
    $token = $_COOKIE['Token'];
    $userAuth = new userAuth();
    if($userAuth->verifyToken($token)){
      $decodedArray = JWT::decode($token,$_SERVER['tokenKey'],array('HS256'));
      $name = $this->request->getVar('name');
      $id = $decodedArray->id;
      $listsModel = new listsModel();
      $data = array(
        'name' => $name,
        'user_id' => $id,
      );
      echo $listsModel->addList($data);

      $this->response->setStatusCode(200);
    }
    else{
      $this->response->setStatusCode(401);
      return;
    }
  }
  function  update(){
    $token = $_COOKIE['Token'];
    $userAuth = new userAuth();
    if($userAuth->verifyToken($token)){
      $decodedArray = JWT::decode($token,$_SERVER['tokenKey'],array('HS256'));
      $name = $this->request->getRawInput()['name'];
      $list_id =$this->request->getRawInput()['id'];
      $listsModel = new listsModel();
      $data = array(
        'name' => $name,
        'id' => $list_id,
        'user_id' => $decodedArray->id,
      );
      $listsModel->updateList($data);
      $this->response->setStatusCode(200);
    }
    else{
      $this->response->setStatusCode(401);
    }
  }
  function  delete($id = false){
    if(!empty($id)){
      $token = $_COOKIE['Token'];
      $userAuth = new userAuth();
      if($userAuth->verifyToken($token)){
        $decodedArray = JWT::decode($token,$_SERVER['tokenKey'],array('HS256'));
        $list_id = $id;
        $listsModel = new listsModel();
        $data = array(
          'id' => $list_id,
          'user_id' => $decodedArray->id,
        );
        $listsModel->deleteList($data);
        $tasksModel = new tasksModel();
        $tasksModel->deleteAllListTasks($id,$data['user_id']);
        $this->response->setStatusCode(200);
      }
      else{
        $this->response->setStatusCode(401);
      }
    }
    else{
      return;
    }
  }
}
?>
