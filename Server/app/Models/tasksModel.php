<?php
namespace App\Models;
use CodeIgniter\Model;
class tasksModel extends Model{
  function readTask($user_id){
    $query = $this->db->table('tasks')
    ->where('user_id',$user_id)
    ->get();
    $result;
    foreach($query->getResult() as $i => $row){
      $result[$i] = array(
        "id" => $row->id,
        "list_id" => $row->list_id,
        "name" => $row->name,
        "importance" => $row->importance,
        "completed" => $row->completed,
      );
    }
    return $result;
  }
  function createTask($data){
    $this->db->table('tasks')
    ->insert($data);
    $id= $this->db->insertID();
    $temp = array(
      "id" => strval($id),
      "list_id" => $data['list_id'],
      "name" => $data['name'],
      "importance" => $data['importance'],
      "completed" => false,
    );
    return json_encode($temp);
  }
  function updateTask($data){
    $this->db->table('tasks')
    ->set('name',$data['name'])
    ->set('importance',$data['importance'])
    ->set('completed',$data['completed'])
    ->where('id',$data['id'])
    ->where('user_id',$data['user_id'])
    ->update();
  }
  function deleteTask($data){
    $this->db->table('tasks')
    ->where('id',$data['id'])
    ->where('user_id',$data['user_id'])
    ->delete();
  }
 function deleteAllListTasks($list_id,$user_id){
   $this->db->table('tasks')
   ->where('list_id',$list_id)
   ->where('user_id',$user_id)
   ->delete();
 }
}
?>
