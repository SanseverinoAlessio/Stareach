<?php
namespace App\Controllers;
use App\Models\usersModel;
use CodeIgniter\Controller;
use \Firebase\JWT\JWT;
use App\Controllers\userAuth;
class userFile extends Controller{
  function __construct(){
    helper('filesystem');
    header('Access-Control-Allow-Credentials: true');
    header('Content-Type: multipart/form-data');
    header('Access-Control-Allow-Origin:' . $_SERVER['angularHost']);
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
  }
  function updateAvatar(){
    $token = $_COOKIE['Token'];
    $userAuth = new userAuth();
    $usersModel = new usersModel();
    if($userAuth->verifyToken($token)){
      $file = $this->request->getFiles('avatar')['avatar'];
      $decodedToken = JWT::decode($token,$_SERVER['tokenKey'],array('HS256'));
      $id = $decodedToken->id;
      if($file->isValid()){
        $type = $file->getMimeType();
        if(preg_match("/\/(gif|jpe?g|tiff?|png|webp|bmp)/",$type)){
          $newName = $file->getRandomName();
          $values = $usersModel->findUserById($id);
          $oldFileName = $values['avatar'];
          if(!empty($oldFileName)){
            if(file_exists(ROOTPATH . 'public/usersAvatar/' . $oldFileName)){
              unlink(ROOTPATH . 'public/usersAvatar/'.$oldFileName);
            }
          }
          $file->move( ROOTPATH . 'public/usersAvatar', $newName);
          $data = array(
            "id" => $id,
            "avatar" => $newName,
          );
          $usersModel->updateAvatar($data);
          echo json_encode(array(
            "url" => base_url('/usersAvatar/' .$newName),
          ));
        }
        else{
          echo json_encode(array(
            "errore" => "Non è un'immagine",
          ));
        }
      }
    }
    else{
      $this->response->setStatusCode(401);
    }
  }
  function deleteAvatar(){
    $token = $_COOKIE['Token'];
    $userAuth = new userAuth();
    $usersModel = new usersModel();
    if($userAuth->verifyToken($token)){
      $decodedToken = JWT::decode($token,$_SERVER['tokenKey'],array('HS256'));
      $id = $decodedToken->id;
      $values = $usersModel->findUserById($id);
      $oldAvatar = $values['avatar'];
      if(!empty($oldAvatar)){
        $url = ROOTPATH . 'public/usersAvatar/'.$oldAvatar;
        unlink($url);
        $data = array(
          "id" => $id,
          "avatar" => '',
        );
        $usersModel->updateAvatar($data);
      }
    }
  }
}
?>
