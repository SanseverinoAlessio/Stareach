<?php
namespace App\Models;
use CodeIgniter\Model;
class usersModel extends Model{
  public function getUsers($id = false){
    if($id == false){
      $query = $this->db->table('users')
      ->get();
    }
    else{
      $query = $this->db->table('users')
      ->where(array('id'=>$id,
    ))
    ->get();
  }
  foreach($query->getResult() as $row){
    echo $row->email;
  }
}
public function addUser($data){
  return $this->db->table('users')
  ->insert($data);
}
public function updatePassword(string $newHashedPassword,$userId){
  $this->db->table('users')
  ->where('id',$userId)
  ->set("password",$newHashedPassword)
  ->update();
}
public function updateUserInformation($data){
  $this->db->table('users')
  ->where('id',$data['id'])
  ->set(array("nome"=>$data['name'],
  "email"=> $data['email'],
))
->update();
}
public function updateAvatar($data){
  $this->db->table('users')
  ->set('avatar',$data['avatar'])
  ->where('id',$data['id'])
  ->update();
}

public function emailExist($email){
  $query =  $this->db->table('users')
  ->where(array('email'=>$email))
  ->get();
  foreach($query->getResult() as $row){
    return $row->email;
  }
}
public function findUser($email){
  $userData = '';
  $query = $this->db->table('users')
  ->where(array('email'=> $email))
  ->get();
  foreach($query->getResult() as $row){
    $userData = array(
      "id" => $row->id,
      "password" => $row->password,
      "nome" => $row->nome,
      "avatar" => $row->avatar,
    );
  }
  return $userData;
}
public function findUserById($id){
  $userData = '';
  $query = $this->db->table('users')
  ->where(array('id'=> $id))
  ->get();
  foreach($query->getResult() as $row){
    $userData = array(
      "id" => $row->id,
      "password" => $row->password,
      "nome" => $row->nome,
      "email" => $row->email,
      "avatar" => $row->avatar,
    );
  }
  return $userData;
}
function addPasswordToken($data){
  $this->db->table('password_reset_request')
  ->insert($data);
  return;
}
function verifyPasswordToken($token){
  $query = $this->db->table('password_reset_request')
  ->where('token',$token)
  ->get();
  $result = $query->getResult();
  return $result;
}
function deletePasswordToken(string $token){
  $this->db->table('password_reset_request')
  ->where('token',$token)
  ->delete();
}



}
?>
