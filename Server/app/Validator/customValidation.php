<?php
namespace App\Validator;


class customValidation{
  function checkPassword(string $password, string &$error = null) :bool
  {
    $pattern = "/^[A-Z]\w+(\d{1}\w+)$/";
    if(preg_match($pattern,$password))
    {
      return true;
    }
    else{
      return false;
    }
  }
}
