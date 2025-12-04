import { Injectable, signal } from "@angular/core";
import { Observable, BehaviorSubject, ReplaySubject } from "rxjs";
import { ApiService } from "./api.service";
import { UserTypeService } from "./role.service";
import { JwtService } from "./jwt.service";
import { Artist, Category, Concert, Filters, Product, ProductCategory, User, UserCompany, Venue } from "../models";
import { map, distinctUntilChanged, tap } from "rxjs/operators";
import { __values } from "tslib";
import { HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/evironment";

const company_port = environment.company_port;

@Injectable({
  providedIn: "root",
})
export class UserCompanyService {
  private currentUserCompanySubject = new BehaviorSubject<UserCompany>({} as UserCompany);
  public currentUserCompany = this.currentUserCompanySubject.asObservable().pipe(distinctUntilChanged());

  private isCompanyAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isCompanyAuthenticated = this.isCompanyAuthenticatedSubject.asObservable();

  public auth$ = new BehaviorSubject<boolean>(!!this.jwtService.getToken());

  //data signals
  private _products = signal<Product[] | null>(null);
  products = this._products.asReadonly();

  private _productCategories = signal<ProductCategory[] | null>(null);
  productCategories = this._productCategories.asReadonly();

  constructor(private apiService: ApiService, private jwtService: JwtService, private userTypeService: UserTypeService) {}

  populate() {
    const token = this.jwtService.getToken();
    if (!token) {
      console.warn("No hay token de userCompany, purgando auth");
      this.purgeAuth();
      return;
    }
    this.apiService.get(company_port, "/user-company/data").subscribe({
      next: (data) => {
        this.setAuth(data.user, token);
      },
      error: (err) => {
        console.error("Error en populate userCompany:", err);
        this.purgeAuth();
      },
    });
  }

  setAuth(user: UserCompany, token: string) {
    this.jwtService.saveToken(token);
    this.currentUserCompanySubject.next(user);
    this.isCompanyAuthenticatedSubject.next(true);
  }

  refreshToken(): Observable<any> {
    return this.apiService.post(company_port, "/user-company/refreshToken", undefined).pipe(
      tap((res: any) => {
        this.jwtService.saveToken(res.accessToken);
        this.auth$.next(true);
      })
    );
  }

  purgeAuth(): Observable<any> {
    return this.apiService.post(company_port, "/user-company/logout", undefined).pipe(
      tap((res) => {
        this.jwtService.destroyToken();
        this.userTypeService.clearUserType();
        this.currentUserCompanySubject.next({} as UserCompany);
        this.isCompanyAuthenticatedSubject.next(false);
        this.auth$.next(false);
      })
    );
  }

  attemptAuth(type: string, credentials: any): Observable<UserCompany> {
    const route = type === "login" ? "/login" : "/register";
    return this.apiService.post(company_port, `/user-company${route}`, { user: credentials }).pipe(
      map((res: any) => {
        console.log("Respuesta de attemptAuth:", res);
        this.setAuth(res.user, res.accessToken);
        return res.user;
      })
    );
  }

  getCurrentUser(): UserCompany {
    return this.currentUserCompanySubject.value;
  }

  // products data
  getAllProducts(): Observable<Product[]> {
    return this.apiService.get(company_port, "/product/list").pipe(
      map((response: { products: any[] }) =>
        response.products.map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          description: p.description,
          productCategory: p.productCategory,
          price: p.price,
          stockTotal: p.stockTotal,
          stockAvailable: p.stockAvailable,
          imageUrl: p.imageUrl,
          status: p.status,
          isActive: p.isActive,
        }))
      ),
      tap((products: Product[]) => {
        this._products.set(products);
      })
    );
  }

  createProduct(product: Product): Observable<any> {
    return this.apiService.post(company_port, "/product", product).pipe(
      tap((response: any) => {
        if (response.success === true && response.product) {
          const newProduct = response.product;
          this._products.update((products) => (products ? [...products, newProduct] : [newProduct]));
        } else {
          console.warn("No se pudo crear el producto:", response.message);
        }
      })
    );
  }

  updateProduct(slug: string, product: Product): Observable<any> {
    return this.apiService.put(company_port, `/product/${slug}`, product).pipe(
      tap((response: any) => {
        if (response.success === true && response.product) {
          const updatedProduct = response.product;
          this._products.update((products) => products?.map((p) => (p.slug === slug ? { ...p, ...updatedProduct } : p)) || null);
        } else {
          console.warn("No se pudo actualizar el producto:", response.message);
        }
      })
    );
  }

  deleteProduct(slug: string): Observable<any> {
    return this.apiService.delete(company_port, `/product/${slug}`).pipe(
      tap((response: any) => {
        if (response.success === true) {
          this._products.update((products) => products?.filter((p) => p.slug !== slug) || null);
        } else {
          console.warn("No se pudo eliminar el producto:", response.message);
        }
      })
    );
  }

  // productCategories data
  getAllProductCategories(): Observable<ProductCategory[]> {
    return this.apiService.get(company_port, "/product-category/list").pipe(
      map((response: { categories: any[] }) =>
        response.categories.map((cat) => ({
          id: cat.id,
          slug: cat.slug,
          name: cat.name,
          description: cat.description,
          image: cat.image,
          isActive: cat.isActive,
        }))
      ),
      tap((categories: ProductCategory[]) => {
        this._productCategories.set(categories);
      })
    );
  }

  createProductCategory(category: ProductCategory): Observable<any> {
    return this.apiService.post(company_port, "/product-category", category).pipe(
      tap((response: any) => {
        if (response.success === true && response.category) {
          const newCategory = response.category;
          this._productCategories.update((categories) => (categories ? [...categories, newCategory] : [newCategory]));
        } else {
          console.warn("No se pudo crear la categoría:", response.message);
        }
      })
    );
  }

  updateProductCategory(slug: string, category: ProductCategory): Observable<any> {
    return this.apiService.put(company_port, `/product-category/${slug}`, category).pipe(
      tap((response: any) => {
        if (response.success === true && response.category) {
          const updatedCategory = response.category;
          this._productCategories.update(
            (categories) => categories?.map((c) => (c.slug === slug ? { ...c, ...updatedCategory } : c)) || null
          );
        } else {
          console.warn("No se pudo actualizar la categoría:", response.message);
        }
      })
    );
  }

  deleteProductCategory(slug: string): Observable<any> {
    return this.apiService.delete(company_port, `/product-category/${slug}`).pipe(
      tap((response: any) => {
        if (response.success === true) {
          this._productCategories.update((categories) => categories?.filter((c) => c.slug !== slug) || null);
        } else {
          console.warn("No se pudo eliminar la categoría:", response.message);
        }
      })
    );
  }
}
