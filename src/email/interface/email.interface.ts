export interface IEmailPayload {
  appname: string;
  to: string;
  subject: string;
  template: string;
  values: any;
  lang: string;
}
