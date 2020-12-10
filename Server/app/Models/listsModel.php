<?php
namespace App\Models;
use CodeIgniter\Model;
use App\Models\tasksModel;
class listsModel extends Model{
  function addList($data){
    $this->db->table('task_lists')
    ->insert($data);

    $id= $this->db->insertID();
    return json_encode(array(
      "name"=> $data['name'],
      "id" => $id,
    ));
  }
  function updateList($data){
    $this->db->
    table('task_lists')
    ->set('name',$data['name'])
    ->where('id',$data['id'])
    ->where('user_id',$data['user_id'])
    ->update($data);
  }
  function deleteList($data){
    $this->db->table('task_lists')
    ->where('id',$data['id'])
    ->where('user_id',$data['user_id'])
    ->delete();
  }

  function readList($userId){
    $query = $this->db->table('task_lists')
    ->where('user_id',$userId)
    ->get();
    $arr = array();
    $counter = 0;
    foreach($query->getResult() as $row){
      $arr[$counter] = array(
        "id" => $row->id,
        "name" => $row->name,
      );
      $counter++;
    }
    return $arr;
  }
}
?>
