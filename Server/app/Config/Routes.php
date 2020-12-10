<?php namespace Config;

// Create a new instance of our RouteCollection class.
$routes = Services::routes();

// Load the system's routing file first, so that the app and ENVIRONMENT
// can override as needed.
if (file_exists(SYSTEMPATH . 'Config/Routes.php'))
{
	require SYSTEMPATH . 'Config/Routes.php';
}

/**
* --------------------------------------------------------------------
* Router Setup
* --------------------------------------------------------------------
*/
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
$routes->setAutoRoute(true);

/**
* --------------------------------------------------------------------
* Route Definitions
* --------------------------------------------------------------------
*/

//$routes->option('(:any)','Cors::Request');
$routes->get('user/(:num)', 'Users::view/$1');
$routes->get('email/(:any)', 'Users::email/$1');
$routes->match(['post','put'],'user/updateInformation', 'Users::updateInformation');
$routes->match(['post','put'],'user/updatePassword', 'Users::updatePassword');
$routes->match(['post','put'],'user/updateAvatar','userFile::updateAvatar');
$routes->match(['get','delete'],'user/deleteAvatar','userFile::deleteAvatar');
$routes->match(['post'],'user/sendResetEmail','Users::sendResetEmail');
$routes->match(['post'],'user/resetPassword','Users::resetPasswordByToken');
$routes->match(['post'],'register','Users::Register');
$routes->match(['post'], 'login', 'userAuth::Login');
$routes->get('islogged', 'userAuth::isLogged');
$routes->get('logout', 'Users::logout');
$routes->get('getSessionData', 'Users::getSessionData');
$routes->match(['post'], 'list/create' ,'taskLists::create');
$routes->match(['put','post'], 'list/update' ,'taskLists::update');
$routes->match(['delete','get'], 'list/delete/(:num)' ,'taskLists::delete/$1');
$routes->get('list/read', 'taskLists::read');
$routes->match(['post'], 'task/create', 'tasks::create');
$routes->match(['put','post'], 'task/update', 'tasks::update');
$routes->match(['delete','get'], 'task/delete/(:num)', 'tasks::remove/$1');
$routes->get('task/read', 'tasks::read');



// We get a performance increase by specifying the default
// route since we don't have to scan directories.


/**
* --------------------------------------------------------------------
* Additional Routing
* --------------------------------------------------------------------
*
* There will often be times that you need additional routing and you
* need it to be able to override any defaults in this file. Environment
* based routes is one such time. require() additional route files here
* to make that happen.
*
* You will have access to the $routes object within that file without
* needing to reload it.
*/
if (file_exists(APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php'))
{
	require APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php';
}
