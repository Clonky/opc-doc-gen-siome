import { Component } from '@angular/core';
import { SiomeConverter } from 'opc-doc-gen';

import { SiomeApiProviderService } from '../../services/siome-api-provider.service';
import { ISiomeApi } from '../../shared/public-api/interfaces/siome-api.interface';

@Component({
  selector: 'app-opc-doc-gen-index',
  standalone: true,
  imports: [],
  templateUrl: './opc-doc-gen-index.component.html',
  styleUrl: './opc-doc-gen-index.component.css',
})
export class OpcDocGenIndexComponent {
  formData = {
    targetspec: '',
  };

  constructor(private siomeApiProvider: SiomeApiProviderService) { }

  private get siomeApi(): ISiomeApi {
    return this.siomeApiProvider.siomeApi!;
  }

  async onSubmit() {
    await this.siomeApi.createLogNode('OPC Doc Gen Service');
    await this.siomeApi.newLogEntry(
      `Received request for doc creation. Target spec = ${this.formData.targetspec}`,
      'info',
    );
    const target = this.formData.targetspec!;
    const nns = await this.siomeApi.getNamespaceArray();
    const specs = nns.map(async (ins) => await this.siomeApi.getNamespace(ins));
    const converter = new SiomeConverter(target, specs);
  }
}
