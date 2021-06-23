import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Empresa } from '../../models/empresa';
import { EmpresasService } from '../../services/empresas.service';
import { ModalDialogService } from '../../services/modal-dialog.service';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {
  Titulo = 'Empresas';
  AccionAC = 'C';
  Mensajes = {
    SD: ' No se encontraron registros...'
  };
  Empresas: Empresa[] = null;

  FormBusqueda: FormGroup;
  FormRegistro: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private empresasService: EmpresasService,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() { 
    this.FormRegistro = this.formBuilder.group({
      RazonSocial: [null],
      CantidadEmpleados: [null],
      FechaFundacion: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
          )
        ]
      ]
    });
  }

  Buscar() {
    this.empresasService.get().subscribe((res: any) => {
      this.Empresas = res;
    });
  }

  Agregar() {
    this.AccionAC = 'A';
    this.FormRegistro.reset({ IdEmpresa: 0 });
    this.FormRegistro.markAsUntouched();
  }

  Grabar() {
    if (this.FormRegistro.invalid) {
      return;
    }

    const itemCopy = { ...this.FormRegistro.value };

    if (this.AccionAC == 'A') {
      this.empresasService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro agregado correctamente.');
        this.Buscar();
      });
    }
  }

  Volver() {
    this.AccionAC = 'C';
  }
}
