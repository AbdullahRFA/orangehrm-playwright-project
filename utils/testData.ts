export function generateEmployee() {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  

  return {
    firstName: 'Rakib',
    lastName: `${randomNumber}`,
    employeeId: `${randomNumber}${Date.now().toString().slice(-4)}`
  };
}