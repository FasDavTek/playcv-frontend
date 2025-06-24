export interface INavItem {
  name: string;
  img?: any;
  route: string;
  children?: {
    name: string;
    route: string;
    img?: any;
  }[];
}
