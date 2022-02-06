export default interface Auth {
  userinfo_endpoint: string,
  authorization_endpoint: string,
  token_endpoint: string,
  end_session_endpoint: string,
  account_management_web_ui: string,
  client_id: string
}
