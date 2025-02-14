import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';
import { UserService } from '../../services/usuario-service/usuario.service';
import { PacientesService } from '../../services/paciente-service/paciente.service';
import { VitalesService } from '../../services/vitales/vitales.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule, NgxPaginationModule],
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss'],
})
export class PacientesComponent implements OnInit, AfterViewInit {  
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private readonly userService: UserService,
    private readonly msalService: MsalService,
    private pacientesService: PacientesService,
    private vitalesService: VitalesService
  ) {}

  currentUser: any;
  pacientes: any[] = []; 
  showModal: boolean = false; 
  isEditMode: boolean = false; 
  nuevoPaciente: any = {
    rut: '',
    dv: '',
    nombre: '',
    apellido: '',
    edad: null,
  };
  pacientesSeleccionado: any = null;
  showDeleteModal: boolean = false; 
  pacienteToDelete: any = null;
  showSignosVitalesModal: boolean = false;
  pacienteActual: any = null;
  signosVitales: any[] = []; // Lista completa de signos vitales
  signosVitalesPaginados: any[] = []; // Lista para mostrar por página
  page: number = 1;
  pageSize: number = 5; // Cantidad de registros por página


   /**
   * Abre el modal para agregar o editar un producto.
   * @param editMode Indica si se está editando un producto existente.
   */
   openModal(editMode: boolean = false) {
    this.showModal = true;
    this.isEditMode = editMode;
  }

  /**
   * Cierra el modal de edición/agregación de producto.
   */
  closeModal() {
    this.showModal = false;
    this.isEditMode = false;
    this.pacientesSeleccionado = null;
    this.resetForm();
  }

  /**
   * Reinicia el formulario de producto nuevo.
   */
  resetForm() {
    this.nuevoPaciente = {
      rut: '',
      dv: '',
      nombre: '',
      apellido: '',
      edad: null,
    };
  }


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

    // Cargar la lista de pacientes
    this.cargarPacientes();
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

  // Manejo de pacientes
  cargarPacientes(): void {
    this.pacientesService.getPacientes().subscribe({
      next: (data) => (this.pacientes = data),
      error: (err) => console.error('Error cargando pacientes:', err),
    });
  }

  openAddPacienteModal() {
    this.isEditMode = false;
    this.nuevoPaciente = {
      rut: '',
      dv: '',
      nombre: '',
      apellido: '',
      edad: null,
    };
    this.showModal = true;
  }


  guardarPaciente() {
    if (this.nuevoPaciente.rut.includes('-')) {
      const [rut, dv] = this.nuevoPaciente.rut.split('-'); // Divide por el guion
      this.nuevoPaciente.rut = rut; // Asigna solo el número al campo rut
      this.nuevoPaciente.dv = dv;  // Asigna el dígito verificador
    }
    if (this.isEditMode && this.pacientesSeleccionado) {
      // Lógica para actualizar el producto existente
      this.pacientesService.updatePaciente(this.pacientesSeleccionado.id, this.nuevoPaciente).subscribe(
        (response) => {
          console.log('Paciente actualizado correctamente:', response);
          this.ngOnInit();
          this.closeModal();
          alert('Paciente actualizado correctamente');
        },
        (error) => {
          console.error('Error al actualizar paciente:', error);
          alert('Error al actualizar paciente');
        }
      );
    } else {
      // Lógica para agregar un nuevo producto
      console.log('Guardando paciente:', this.nuevoPaciente);
      this.pacientesService.addPaciente(this.nuevoPaciente).subscribe(
        (response) => {
          console.log('Paciente agregado correctamente:', response);
          this.ngOnInit();
          this.closeModal();
          alert('Paciente agregado correctamente');
        },
        (error) => {
          console.error('Error al agregar Paciente:', error);
          alert('Error al agregar paciente');
        }
      );
    }
  }

  editarPaciente(paciente: any): void {
    if (paciente) {
      this.pacientesSeleccionado = paciente;
  
      // Asignar todos los datos correctamente
      this.nuevoPaciente = {
        nombre: paciente.nombre || '',
        apellido: paciente.apellido || '',
        rut: paciente.rut.includes('-') ? paciente.rut : `${paciente.rut}-${paciente.dv}`,
        dv: paciente.dv || '',
        edad: paciente.edad || null,
      };
  
      this.openModal(true); // Abre el modal en modo edición
      console.log('Paciente a editar:', this.nuevoPaciente); // Depuración
    } else {
      console.error('No se encontró el paciente para editar');
    }
  }


     /**
   * Abre el modal para confirmar la eliminación de un producto.
   * @param product Producto a eliminar.
   */
     openDeleteModal(paciente: any) {
      this.showDeleteModal = true;
      this.pacienteToDelete = paciente;
    }
  
    /**
     * Cierra el modal de eliminación de pacientes.
     */
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.pacienteToDelete = null;
    }
  


  eliminarPaciente() {
    if (this.pacienteToDelete) {
      this.pacientesService.deletePaciente(this.pacienteToDelete.id).subscribe(
        (response) => {
          console.log('Paciente eliminado correctamente:', response);
          this.ngOnInit();
          this.closeDeleteModal();
          alert('Paciente eliminado correctamente');
        },
        (error) => {
          console.error('Error al eliminar paciente:', error);
          alert('Error al eliminar paciente');
        }
      );
    }
  }


  openSignosVitalesModal() {
    this.showSignosVitalesModal = true;
  }

  
  verSignosVitales(paciente: any) {
    if (paciente) {
      this.pacienteActual = paciente;

      // Llamar al servicio para obtener los signos vitales del paciente
      this.vitalesService.getSenalesVitales(paciente.id).subscribe({
        next: (data) => {
          this.signosVitales = data;
          this.cambiarPagina(1); // Cargar primera página
          this.showSignosVitalesModal = true;
        },
        error: (err) => console.error('Error obteniendo signos vitales:', err)
      });
    }
  }

  cambiarPagina(pagina: number) {
    this.page = pagina;
    const startIndex = (pagina - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.signosVitalesPaginados = this.signosVitales.slice(startIndex, endIndex);
  }

  closeSignosVitalesModal() {
    this.showSignosVitalesModal = false;
    this.pacienteActual = null;
    this.signosVitales = [];
  }

}
