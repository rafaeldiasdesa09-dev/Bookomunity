// LOGIN
apiRoutes.post("/api/login", clientController.LoginUser);
// CADASTRO
apiRoutes.post("/api/registro", upload.single("foto"), clientController.CreateUser);
// SAIR DA CONTA
apiRoutes.get("/logoff", clientController.logoff)
// DELETAR CONTA
apiRoutes.delete("/api/delete/:id", clientController.deleteUser)