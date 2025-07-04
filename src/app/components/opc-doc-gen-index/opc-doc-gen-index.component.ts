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
  rendered_view = '';
  dl_link = '';
  options: string[] = [];

  constructor(private siomeApiProvider: SiomeApiProviderService) { }

  private get siomeApi(): ISiomeApi {
    return this.siomeApiProvider.siomeApi!;
  }

  async prepare_nodesets(): Promise<Document[]> {
    const nns = await this.siomeApi.getNamespaceArray();
    await this.siomeApi.newLogEntry('Found the following namespaces:', 'info');
    await this.siomeApi.newLogEntry(`Found ${nns.length} namespaces`, 'info');
    const specs: Document[] = [];
    const parser = new DOMParser();
    for (const ins of nns) {
      await this.siomeApi.newLogEntry(
        `Adding namespace ${ins} to catalogue`,
        'info',
      );
      const res = await this.siomeApi.getNodesetAsString([ins], true, true);
      specs.push(parser.parseFromString(res, 'text/xml'));
    }
    return specs;
  }

  set_blob_link(blob: Blob): string {
    const url = URL.createObjectURL(blob);
    return `<a href=${url} download>Download docx</a>`;
  }

  async loadOptions() {
    const nns = await this.siomeApi.getNamespaceArray();
    this.options = nns;
  }

  async onSubmit() {
    try {
      this.options = await this.siomeApi.getNamespaceArray();
      await this.siomeApi.createLogNode('OPC Doc Gen Service');
      if (!this.formData.targetspec) throw Error('No target spec chosen');
      const target = this.formData.targetspec;
      await this.siomeApi.newLogEntry(
        `Received request for doc creation. Target spec = ${this.formData.targetspec}`,
        'info',
      );
      const specs = await this.prepare_nodesets();
      const converter = new SiomeConverter(target, specs);
      const write_result = converter.write();
      this.rendered_view = write_result.html;
      const blob = await write_result.blob;
      this.dl_link = this.set_blob_link(blob);
    } catch (e) {
      await this.siomeApi.newLogEntry(
        `Encountered error while running converter: ${e}`,
        'error',
      );
    }
  }
}
