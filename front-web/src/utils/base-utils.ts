import { router } from "@/plugins/1.router"

export interface I_User {
  id: string
  password: string
  username: string
  email: string
  name: string
  first_name: string
  last_name: string
  created: string
}

export enum E_LocalStorageKeys{
  TOKEN = 'ekasan-token',
  USERID = 'ekasan-user',
  EXPIRES = 'ekasan-expires-token'
}

export function deleteLocalStorage(){
  localStorage.removeItem(E_LocalStorageKeys.TOKEN)
  localStorage.removeItem(E_LocalStorageKeys.USERID)
  localStorage.removeItem(E_LocalStorageKeys.EXPIRES)
  
}

// Fonction pour formater la date en chaîne de caractères
export function dateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function isTokenRevoked(){
  const now = new Date();
  const formattedNow = dateToString(now);
  const stringTokenDate = localStorage.getItem(E_LocalStorageKeys.EXPIRES)
  if(stringTokenDate){

    const storedDate = new Date(stringTokenDate); // Remplacez par votre date enregistrée
    const formattedStoredDate = dateToString(storedDate);
    
    // Calculez la différence en millisecondes
    const diffInMilliseconds = now.getTime() - storedDate.getTime();
    
    // Convertissez 12 heures en millisecondes
    const twelveHoursInMilliseconds = 12 * 60 * 60 * 1000;
    
    // Vérifiez si la date actuelle est supérieure de moins de 12 heures après la date enregistrée
    if (diffInMilliseconds >= 0 && diffInMilliseconds <= twelveHoursInMilliseconds) {
        console.log('La date actuelle est supérieure de moins de 12 heures après la date enregistrée.');
        return true
    } else {
        console.log('La date actuelle est soit antérieure, soit supérieure de plus de 12 heures après la date enregistrée.');
        return false
    }
  }
  return true
  // Exemple de date enregistrée
  
}

export function checkLocalStorage(){
  if(
    !localStorage.getItem(E_LocalStorageKeys.TOKEN) 
    || !localStorage.getItem(E_LocalStorageKeys.TOKEN) 
  ){
    return false
  }
  return localStorage.getItem(E_LocalStorageKeys.EXPIRES) ? isTokenRevoked() : false
}