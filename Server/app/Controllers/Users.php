<?php
namespace App\Controllers;
$this->validation =  \Config\Services::validation();
use App\Models\usersModel;
use CodeIgniter\Controller;
use App\Validator\customValidation;
use \Firebase\JWT\JWT;
use App\Controllers\userAuth;
class Users extends Controller {
  public $validation;
  function __construct(){
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Origin:' . $_SERVER['angularHost']);
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    $this->validation =  \Config\Services::validation();
  }
  public function index(){
    $userModel = new usersModel();
    echo $userModel->getUsers();
  }
  public function view($id = false){
    $usersModel = new usersModel();
    $data['email'] = $usersModel->getUsers($id);
    if(isset($data['email']) && !empty($data['email'])){
      echo $data['email'];
    }
  }
  public function email($email = false){
    if($email !== false){
      $usersModel = new usersModel();
      $result = $usersModel->emailExist($email);
      if(strlen($result) > 0){
        $arr = array(
          "value" => true,
        );
      }
      else{
        $arr = array(
          "value" => false,
        );
      }
      echo json_encode($arr);
    }
    else{
      return null;
    }
  }
  public function updateInformation(){
    $token = $_COOKIE['Token'];
    $userAuth = new userAuth();
    if($userAuth->verifyToken($token)){
      $decodedToken = JWT::decode($token,$_SERVER['tokenKey'],array('HS256'));
      $id = $decodedToken->id;
      $this->validation->setRules([
        'name' => 'required|min_length[4]|max_length[16]',
        'email' => 'required|valid_email',
      ],
      [
        'name' => [
          'required' => 'Inserire il nome utente',
          'min_length' => 'Il nome deve essere lungo almeno 4 caratteri',
          "max_length" => 'Il nome può avere un massimo di 16 caratteri',
        ],
        "email" =>[
          'required' => "Inserire l'email",
          'valid_email' => "Inserire un'email valida",
        ]
      ]);
      $this->validation->withRequest($this->request)->run();
      if(!$this->validation->run()){
        echo json_encode($this->validation->getErrors());
      }
      else{
        $usersModel = new usersModel();
        $data = array(
          "name" => $this->request->getVar('name'),
          "email" => $this->request->getVar('email'),
          "id" => $id,
        );
        $this->response->setStatusCode('200');
        $usersModel->updateUserInformation($data);
      }
    }
    else{
      $this->response->setStatusCode(401);
    }
  }
  public function updatePassword(){
    $token = $_COOKIE['Token'];
    $userAuth = new userAuth();
    $usersModel = new usersModel();
    if($userAuth->verifyToken($token)){
      $this->response->setStatusCode(200);
      $decodedToken = JWT::decode($token,$_SERVER['tokenKey'],array('HS256'));
      $userId = $decodedToken->id;
      $this->validation->setRules([
        "oldPassword" => 'required|checkPassword',
        "newPassword" => 'required|checkPassword',
      ],[
        "oldPassword" => [
          "required" => 'É richiesta la vecchia password',
          "checkPassword" => "La password non è valida",
        ],
        "newPassword" => [
          "required" => 'É richiesta la vecchia password',
          "checkPassword" => "La password non è valida",
        ],
      ]);
      $this->validation->withRequest($this->request)->run();
      if(!$this->validation->run()){
        echo json_encode($this->validation->getErrors());
      }
      else{
        $oldPassword = $this->request->getVar('oldPassword');
        $newPassword = $this->request->getVar('newPassword');
        $result = $usersModel->findUserById($userId);
        if(password_verify($oldPassword,$result['password'])){
          if(!password_verify($newPassword,$result['password'])){
            $newHashedPassword = password_hash($newPassword,PASSWORD_DEFAULT);
            $usersModel->updatePassword($newHashedPassword,$userId);
            echo json_encode(array(
              "success" => "La password è stata modifica",
            ));
          }
          else{
            echo json_encode(array(
              "same" => "La password è uguale alla precedente",
            ));
          }
        }
        else{
          echo json_encode(array(
            "errore" => 'La vecchia password non è corretta',
          ));
        }
      }
    }
    else{
      $this->response->setStatusCode(401);
      return;
    }
  }
  public function Register(){
    $usersModel = new usersModel();
    if($this->request->getMethod() == 'post'){
      $this->validation->setRules([
        'username' => 'required|min_length[4]|max_length[16]',
        'email' => 'required|valid_email|is_unique[users.email]',
        'password' => 'required|min_length[4]|checkPassword',
        'repeat_password' => 'matches[password]',
      ],
      [
        'username' => [
          'required' => 'Inserire il nome utente',
          'min_length' => 'Il nome deve essere lungo almeno 4 caratteri',
          "max_length" => 'Il nome può avere un massimo di 16 caratteri',
        ],
        "email" =>[
          'required' => "Inserire l'email",
          'valid_email' => "Inserire un'email valida",
          'is_unique' => "Questa email è già stata utilizzata"
        ],
        "password" => [
          'required' => 'Inserire la password',
          'min_length' => 'La password deve essere lunga almeno 4 caratteri',
          'checkPassword' => 'La password non è valida',
        ],
        "repeat_password" =>[
          "matches" => 'Le password devono coincidere',
        ],
      ]
    );
    $this->validation->withRequest($this->request)->run();
    if(!$this->validation->run()){
      echo json_encode($this->validation->getErrors());
    }
    else{
      $user = array(
        'nome' => $this ->request->getVar('username'),
        'email' => $this ->request->getVar('email'),
        'password' => password_hash($this->request->getVar('password'),PASSWORD_DEFAULT),
        'avatar' => '',
      );
      $usersModel->addUser($user);
      echo json_encode(array(
        "success" => true,
      ));
    }
  }
}
function logout(){
  try{
    $token = $_COOKIE['Token'];
    if(isset($token) && !empty($token)){
      setcookie('Token', '',array(
        "expires" => time() - 3600,
        "path" => '/',
        'domain' => '',
        'secure' => false,
        'httponly'=> true,
        'samesite' => 'Lax',
      ));
      $this->response->setStatusCode(200);
    }
    else{
      $this->response->setStatusCode(401);
    }
  }
  catch(\Exception $e){
    $this->response->setStatusCode(401);
  }
}
function getSessionData(){
  try{
    $token = $_COOKIE['Token'];
    $userAuth = new userAuth();
    $usersModel = new usersModel();
    if(isset($token) && !empty($token)){
      $key = $_SERVER['tokenKey'];
      $decodedToken = JWT::decode($token,$key,array('HS256'));
      $id = $decodedToken->id;
      $this->response->setStatusCode(200);
      $values = $usersModel->findUserById($id);
      $avatarUrl = !empty($values['avatar']) ? base_url('/usersAvatar/' .$values['avatar']) : '';
      return json_encode(array(
        "name" => $values['nome'],
        "email" => $values['email'],
        "avatar" => $avatarUrl,
      ));
    }
    else{
      $this->response->setStatusCode(401);
    }
  }
  catch(\Exception $e){
    $this->response->setStatusCode(401);
  }
}
function sendResetEmail(){
  $this->validation->setRules([
    "email" => 'required|valid_email',
  ],[
    "email" => [
      "required" => "É richieta un'email",
      "valid_email" => "L'email non è valida",
    ],
  ]);
  $this->validation->withRequest($this->request)->run();
  if(!$this->validation->run()){
    echo json_encode($this->validation->getErrors());
  }
  else{
    $usersModel = new usersModel();
    $userEmail = $this->request->getVar('email');
    $exist = $usersModel->findUser($userEmail);
    if(!empty($exist)){
      $this->response->setStatusCode(200);
      $token = bin2hex(openssl_random_pseudo_bytes(64));
      $url =  $_SERVER['angularHost'] . '/password_reset/' . $token;
      $expires =   (getdate()['0'] * 1000) + (10 * 60 * 1000);
      $email = \Config\Services::email();
      $email->setFrom('stareachtodo@gmail.com','Stareach');
      $email->setTo($userEmail);
      $email->setSubject('Reimposta la tua password');
      $email->setMessage('Per reimpostare la password, clicca sul seguente url:
      ' . $url);
      if($email->send()){
        $id = $exist['id'];
        $data = array(
          "user_id" => $id,
          "token" => $token,
          "expires" => $expires,
        );
        $usersModel->addPasswordToken($data);
        echo json_encode(
          array(
            "success"=> true,
          )
        );
      }
      else{
        echo json_encode(
          array(
            "success"=> false,
          )
        );
      }
      return;
    }
    else{
      $this->response->setStatusCode(404);
      return;
    }
  }
}
function resetPasswordByToken(){
  $usersModel = new usersModel();
  $token = $this->request->getVar("token");
  $request = $usersModel->verifyPasswordToken($token);
  if(!empty($request) ){
    $user_id =  $request['0']->user_id;
    $expires = $request['0']->expires;
    if((getdate()['0'] * 1000) < $expires){
      $this->validation->setRules([
        "password" => 'required|checkPassword',
      ],[
        "password" => [
          "required" => "É richiesta la password",
          "checkPassword" => "La password non è valida",
        ],
      ]);
      $this->validation->withRequest($this->request)->run();
      if(!$this->validation->run()){
        echo json_encode($this->validation->getErrors());
      }
      else{
        $password = $this->request->getVar('password');
        $hashedPassword = password_hash($password,PASSWORD_DEFAULT);
        $usersModel->updatePassword($hashedPassword,$user_id);
        $usersModel->deletePasswordToken($token);
        echo json_encode(array(
          "success" => true,
        ));
      }
    }
    else{
      echo json_encode(array(
        "error" => "La richiesta è scaduta",
      ));
      return;
    }
  }
  else{
    $this->response->setStatusCode(404);
    return;
  }
}
}
