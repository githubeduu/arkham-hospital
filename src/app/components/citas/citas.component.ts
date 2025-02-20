import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { UserService } from '../../services/usuario-service/usuario.service';
import { ReservasService } from '../../services/reserva-service/reserva.service';

@Component({
  standalone: true,
    imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
    selector: 'app-citas',
    templateUrl: './citas.component.html',
    styleUrls: ['./citas.component.scss'],
})
export class CitasComponent {
  mensaje = '';
  currentUser: any;
  reserva = {
    cliente: {
      nombre: '',
      correo: '',
      rut: ''
    },
    cita: {
      pacienteNombre: '',
      especialidad: '',
      fechaHora: '',
      doctor: ''
    }
  };

  constructor(private http: HttpClient,
        private renderer: Renderer2,
        private el: ElementRef,
        @Inject(PLATFORM_ID) private platformId: Object,
        private readonly userService: UserService,
        private readonly msalService: MsalService,
        private reservasService: ReservasService,
  ) {}


  
    ngOnInit(): void {
      // Manejo de inicio de sesión
      this.msalService.instance.handleRedirectPromise().then((res) => {
        if (res && res.account) {
          this.msalService.instance.setActiveAccount(res.account);
          this.currentUser = this.msalService.instance.getActiveAccount();
          this.getUserProfile();
        } else if (this.msalService.instance.getActiveAccount()) {
          this.currentUser = this.msalService.instance.getActiveAccount();
          this.getUserProfile();
        } else {
          this.currentUser = this.userService.getCurrentUser();
        }
      }).catch((error) => {
        console.error('Error durante el manejo de inicio de sesión:', error);
      });
    }
  
    
  
    // Manejo del carrusel (si es necesario)
    ngAfterViewInit(): void {
      if (isPlatformBrowser(this.platformId)) {
        let currentSlide: number = 0;
        const slides = this.el.nativeElement.querySelectorAll('.carousel-item');
        const totalSlides: number = slides.length;
  
        if (totalSlides > 0) {
          this.renderer.addClass(slides[currentSlide], 'active');
  
          setInterval(() => {
            this.renderer.removeClass(slides[currentSlide], 'active');
            currentSlide = (currentSlide + 1) % totalSlides;
            this.renderer.addClass(slides[currentSlide], 'active');
          }, 10000);
        }
      }
    }
  
    // Login y Logout
    login(): void {
      this.msalService.loginPopup({ scopes: ['User.Read'] }).subscribe({
        next: (res) => {
          this.msalService.instance.setActiveAccount(res.account);
          this.currentUser = this.msalService.instance.getActiveAccount();
          this.getUserProfile();
          window.location.reload();
        },      
        error: (error) => {
          console.error('Error durante el inicio de sesión:', error);
        },
      });
    }
  
    logout(): void {
      this.msalService.logoutPopup({ mainWindowRedirectUri: "/" });
    }
  
    getUserProfile(): void {
      const accessTokenRequest = { scopes: ['User.Read'] };
      this.msalService.acquireTokenSilent(accessTokenRequest).subscribe({
        next: (response) => {
          const headers = { Authorization: `Bearer ${response.accessToken}` };
          fetch('https://graph.microsoft.com/v1.0/me', { headers })
            .then((res) => res.json())
            .then((profile) => {
              this.currentUser = profile;
              console.log('User profile:', profile);
            })
            .catch((error) => console.error('Error obteniendo el perfil del usuario:', error));
        },
        error: (error) => console.error('Error obteniendo el token:', error),
      });
    }

    reservarCita() {
      this.reserva.cita.pacienteNombre = this.reserva.cliente.nombre;
  
      this.reservasService.reservarCita(this.reserva).subscribe({
        next: (response) => {
          console.log(response);
          this.mensaje = 'Cita reservada exitosamente.';
        },
        error: (error) => {
          console.error(error);
          this.mensaje = 'Hubo un error al reservar la cita.';
        },
      });
    }
    
}
