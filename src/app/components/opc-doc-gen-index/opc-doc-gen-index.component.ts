import { Component } from '@angular/core';
import { SiomeConverter } from 'opc-doc-gen';

import { SiomeApiProviderService } from '../../services/siome-api-provider.service';
import { ISiomeApi } from '../../shared/public-api/interfaces/siome-api.interface';

@Component({
  selector: 'app-opc-doc-gen-index',
  standalone: false,
  templateUrl: './opc-doc-gen-index.component.html',
  styleUrl: './opc-doc-gen-index.component.css',
})
export class OpcDocGenIndexComponent {
  formData = {
    targetspec: '',
  };
  rendered_view: string = '';

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
    await this.siomeApi.newLogEntry("Found the following namespaces:", "info")
    await this.siomeApi.newLogEntry(`Found ${nns.length} namespaces`, "info");
    const specs: string[] = [];
    for (var ins of nns) {
      await this.siomeApi.newLogEntry(`Adding namespace ${ins} to catalogue`, "info");
      let res = await this.siomeApi.getNodesetAsString([ins], true, true);
      await this.siomeApi.newLogEntry(`${res}`, "info");
      specs.push(res);
    }
    try {
      const converter = new SiomeConverter(target, specs);
      try {
        this.rendered_view = converter.write()
      } catch (e) {
        await this.siomeApi.newLogEntry(`error: ${e}`, "error");
      }
    } catch (e) {
      await this.siomeApi.newLogEntry(`error creating converter: ${e}`, "error")
    }
    await this.siomeApi.newLogEntry(`result=\n${this.rendered_view}`, "info")
  }
}
