import { Injectable, signal } from "@angular/core";
import { Observable, BehaviorSubject, ReplaySubject } from "rxjs";
import { ApiService } from "./api.service";
import { UserTypeService } from "./role.service";
import { JwtService } from "./jwt.service";
import { Artist, Category, Concert, Filters, User, UserAdmin, Venue } from "../models";
import { map, distinctUntilChanged, tap } from "rxjs/operators";
import { __values } from "tslib";
import { HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/evironment";

const admin_port = environment.admin_port;

@Injectable({
  providedIn: "root",
})
export class UserAdminService {
  private currentUserAdminSubject = new BehaviorSubject<UserAdmin>({} as UserAdmin);
  public currentUserAdmin = this.currentUserAdminSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  private isAdminAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAdminAuthenticated = this.isAdminAuthenticatedSubject.asObservable();

  public auth$ = new BehaviorSubject<boolean>(!!this.jwtService.getToken());

  //data signals
  private _users = signal<User[] | null>(null);
  users = this._users.asReadonly();

  private _artists = signal<Artist[] | null>(null);
  atrists = this._artists.asReadonly();

  private _venues = signal<Venue[] | null>(null);
  venues = this._venues.asReadonly();

  private _categories = signal<Category[] | null>(null);
  categories = this._categories.asReadonly();

  private _concerts = signal<Concert[] | null>(null);
  concerts = this._concerts.asReadonly();

  constructor(
    private apiService: ApiService,
    private jwtService: JwtService,
    private userTypeService: UserTypeService
  ) {}

  // populate() {
  //   const token = this.jwtService.getToken();
  //   if (token) {
  //     const headers = new HttpHeaders({
  //       "Content-Type": "application/json",
  //       Authorization: `Token ${token}`,
  //     });
  //     this.apiService.get(admin_port, "/api/userAdmin/data").subscribe({
  //       next: (data) => {
  //         return this.setAuth(data.user, token);
  //       },
  //       error: (err) => {
  //         console.error("Error en populate:", err);
  //         this.purgeAuth();
  //       },
  //     });
  //   } else {
  //     console.warn("No hay token, purgando auth");
  //     this.purgeAuth();
  //   }
  // }

  // user-admin.service.ts
  populate() {
    const token = this.jwtService.getToken();

    if (!token) {
      console.warn("No hay token de admin, purgando auth");
      this.purgeAuth();
      return;
    }

    this.apiService.get(admin_port, "/api/userAdmin/data").subscribe({
      next: (data) => {
        this.setAuth(data.user, token);
      },
      error: (err) => {
        console.error("Error en populate admin:", err);
        this.purgeAuth();
      },
    });
  }

  setAuth(user: UserAdmin, token: string) {
    this.jwtService.saveToken(token);
    this.currentUserAdminSubject.next(user);
    this.isAdminAuthenticatedSubject.next(true);
  }

  refreshToken(): Observable<any> {
    return this.apiService.post(admin_port, "/api/auth/refreshToken", undefined).pipe(
      tap((res: any) => {
        this.jwtService.saveToken(res.accessToken);
        this.auth$.next(true);
      })
    );
  }

  purgeAuth(): Observable<any> {
    return this.apiService.post(admin_port, "/api/auth/logout", undefined).pipe(
      tap((res) => {
        this.jwtService.destroyToken();
        this.userTypeService.clearUserType();
        this.currentUserAdminSubject.next({} as UserAdmin);
        this.isAdminAuthenticatedSubject.next(false);
        this.auth$.next(false);
      })
    );
  }

  attemptAuth(type: string, credentials: any): Observable<UserAdmin> {
    const route = type === "login" ? "/login" : "";
    return this.apiService.post(admin_port, `/api/auth${route}`, { user: credentials }).pipe(
      map((res: any) => {
        console.log("Respuesta de attemptAuth:", res);
        this.setAuth(res.user, res.accessToken);
        return res.user;
      })
    );
  }

  getCurrentUser(): UserAdmin {
    return this.currentUserAdminSubject.value;
  }

  //users data
  getAllUsers(): Observable<User[]> {
    return this.apiService.get(admin_port, "/api/users").pipe(
      map((response: { users: User[] }) => response.users),
      tap((users: User[]) => {
        this._users.set(users);
      })
    );
  }

  changeIsActiveUser(username: string, isActive: boolean): Observable<any> {
    console.log("changeIsActiveUser llamado");
    return this.apiService
      .put(admin_port, `/api/user/changeIsActive/${username}`, { isActive })
      .pipe(
        tap((response) => {
          console.log("changeIsActiveUser llamado");
          if (response.success === true) {
            this._users.update((users) => {
              return (
                users?.map((user) => (user.username === username ? { ...user, isActive } : user)) ||
                null
              );
            });
          } else {
            console.warn("No se actualizó isActive porque success !== true", response);
          }
        })
      );
  }

  //artists data
  getAllArtists(filters?: Filters): Observable<Artist[]> {
    // let params = new HttpParams();
    // Object.keys(filters).forEach((key) => {
    //   const value = (filters as any)[key];
    //   if (value !== null && value !== undefined) {
    //     params = params.set(key, value);
    //   }
    // });
    return this.apiService.get(admin_port, "/api/artists").pipe(
      map((response: { artists: any[] }) =>
        response.artists.map((art) => ({
          ...art,
          artist_id: art.id,
        }))
      ),
      tap((artists: Artist[]) => {
        this._artists.set(artists);
      })
    );
  }

  createArtist(artist: Artist): Observable<any> {
    return this.apiService.post(admin_port, "/api/artist", artist).pipe(
      tap((response: any) => {
        if (response.success === true && response.artist) {
          const newArtist = response.artist;
          this._artists.update((artists) => {
            return artists ? [...artists, newArtist] : [newArtist];
          });
        } else {
          console.warn("No se pudo crear el artista:", response.message);
        }
      })
    );
  }

  updateArtist(slug: string, artist: Artist): Observable<any> {
    return this.apiService.put(admin_port, `/api/artist/${slug}`, artist).pipe(
      tap((response: any) => {
        if (response.success === true && response.artist) {
          const updatedArtist = response.artist;
          this._artists.update((artists) => {
            return (
              artists?.map((art) => (art.slug === slug ? { ...art, ...updatedArtist } : art)) ||
              null
            );
          });
        } else {
          console.warn("No se pudo actualizar el artista:", response.message);
        }
      })
    );
  }

  deleteArtist(slug: string): Observable<any> {
    return this.apiService.delete(admin_port, `/api/artist/${slug}`).pipe(
      tap((response: any) => {
        if (response.success === true) {
          this._artists.update((artists) => artists?.filter((art) => art.slug !== slug) || null);
        } else {
          console.warn("No se pudo eliminar el artista:", response.message);
        }
      })
    );
  }

  //venue data
  getAllVenues(filters?: Filters): Observable<Venue[]> {
    return this.apiService.get(admin_port, "/api/venues").pipe(
      map((response: { venues: any[] }) =>
        response.venues.map((ven) => ({
          ...ven,
          venue_id: ven.id,
        }))
      ),
      tap((venues: Venue[]) => {
        this._venues.set(venues);
      })
    );
  }

  createVenue(venue: Venue): Observable<any> {
    return this.apiService.post(admin_port, "/api/venue", venue).pipe(
      tap((response: any) => {
        if (response.success && response.venue) {
          const newVenue = response.venue;
          this._venues.update((venues) => [...(venues || []), newVenue]);
        } else {
          console.warn("No se pudo crear la dirección:", response.message);
        }
      })
    );
  }

  updateVenue(slug: string, venue: Venue): Observable<any> {
    return this.apiService.put(admin_port, `/api/venue/${slug}`, venue).pipe(
      tap((response: any) => {
        if (response.success && response.venue) {
          const updatedVenue = response.venue;
          this._venues.update((venues) =>
            (venues || []).map((ven) => (ven.slug === slug ? { ...ven, ...updatedVenue } : ven))
          );
        } else {
          console.warn("No se pudo actualizar la dirección:", response.message);
        }
      })
    );
  }

  deleteVenue(slug: string): Observable<any> {
    return this.apiService.delete(admin_port, `/api/venue/${slug}`).pipe(
      tap((response: any) => {
        if (response.success === true) {
          this._venues.update((venues) => venues?.filter((ven) => ven.slug !== slug) || null);
        } else {
          console.warn("No se pudo eliminar la direccion:", response.message);
        }
      })
    );
  }

  //category data
  getAllCategories(filters?: Filters): Observable<Category[]> {
    return this.apiService.get(admin_port, "/api/categories").pipe(
      map((response: { categories: any[] }) =>
        response.categories.map((cat) => ({
          ...cat,
          category_id: cat.id, // cat.id existe realmente en la respuesta
        }))
      ),
      tap((categories: Category[]) => {
        this._categories.set(categories);
      })
    );
  }

  createCategory(category: Category): Observable<any> {
    return this.apiService.post(admin_port, "/api/category", category).pipe(
      tap((response: any) => {
        if (response.success === true && response.category) {
          const newCategory = response.category;
          this._categories.update((categories) => {
            return categories ? [...categories, newCategory] : [newCategory];
          });
        } else {
          console.warn("No se pudo crear la categoría:", response.message);
        }
      })
    );
  }

  updateCategory(slug: string, category: Category): Observable<any> {
    return this.apiService.put(admin_port, `/api/category/${slug}`, category).pipe(
      tap((response: any) => {
        if (response.success === true && response.category) {
          const updatedCategory = response.category;
          this._categories.update((categories) => {
            return (
              categories?.map((cat) =>
                cat.slug === slug ? { ...cat, ...updatedCategory } : cat
              ) || null
            );
          });
        } else {
          console.warn("No se pudo actualizar la categoría:", response.message);
        }
      })
    );
  }

  deleteCategory(slug: string): Observable<any> {
    return this.apiService.delete(admin_port, `/api/category/${slug}`).pipe(
      tap((response: any) => {
        if (response.success === true) {
          this._categories.update(
            (categories) => categories?.filter((cat) => cat.slug !== slug) || null
          );
        } else {
          console.warn("No se pudo eliminar la categoría:", response.message);
        }
      })
    );
  }

  //concert data
  getAllConcerts(filters?: Filters): Observable<Concert[]> {
    // let params = new HttpParams();
    // Object.keys(filters).forEach((key) => {
    //   const value = (filters as any)[key];
    //   if (value !== null && value !== undefined) {
    //     params = params.set(key, value);
    //   }
    // });
    return this.apiService.get(admin_port, "/api/concerts").pipe(
      map((response: { concerts: any[] }) =>
        response.concerts.map((con) => ({
          ...con,
          concert_id: con.id,
        }))
      ),
      tap((concerts: Concert[]) => {
        this._concerts.set(concerts);
      })
    );
  }

  createConcert(concert: Concert): Observable<any> {
    return this.apiService.post(admin_port, "/api/concert", concert).pipe(
      tap((response: any) => {
        if (response.success === true && response.concert) {
          const newConcert = response.concert;
          this._concerts.update((concerts) => {
            return concerts ? [...concerts, newConcert] : [newConcert];
          });
        } else {
          console.warn("No se pudo crear el concierto:", response.message);
        }
      })
    );
  }

  updateConcert(slug: string, concert: Concert): Observable<any> {
    return this.apiService.put(admin_port, `/api/concert/${slug}`, concert).pipe(
      tap((response: any) => {
        if (response.success === true && response.concert) {
          const updatedConcert = response.concert;
          this._concerts.update((concerts) => {
            return (
              concerts?.map((c) => (c.slug === slug ? { ...c, ...updatedConcert } : c)) || null
            );
          });
        } else {
          console.warn("No se pudo actualizar el concierto:", response.message);
        }
      })
    );
  }

  deleteConcert(slug: string): Observable<any> {
    return this.apiService.delete(admin_port, `/api/concert/${slug}`).pipe(
      tap((response: any) => {
        if (response.success === true) {
          this._concerts.update((concerts) => concerts?.filter((c) => c.slug !== slug) || null);
        } else {
          console.warn("No se pudo eliminar el concierto:", response.message);
        }
      })
    );
  }
}
