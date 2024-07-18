export interface INavItem {
  name: string;
  img?: string;
  route: string;
  children?: {
    name: string;
    route: string;
    img?: string;
  }[];
}
