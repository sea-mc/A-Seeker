package database

func CheckIfUserIsRegistered(email string) bool {
	sql := "select * from account where email = $1"
	
	return false
}


func RegisterUser(email, password string) error{

	return nil
}


func DeleteUser(email string) error {
	return nil
}

