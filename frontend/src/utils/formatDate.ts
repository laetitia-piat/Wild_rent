export const  formatDate= (dateString: string)=> {
const date = new Date(dateString);

 const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

  return date.toLocaleDateString('fr-FR', options);
}