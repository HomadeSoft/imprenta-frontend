const AuthService = (() => {
  const USER_ADMINS = ["juancriera94@gmail.com", "monipublicar@hotmail.com", "gpublicar@hotmail.com", "nico_pickelny@hotmail.com"]

  const isAdmin = (userEmail) => USER_ADMINS.includes(userEmail)

  return {
    isAdmin: (userEmail) => isAdmin(userEmail)
  }
})()

export default AuthService;