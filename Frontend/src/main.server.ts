import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

// Accept the server BootstrapContext and merge any provided providers
const bootstrap = (context?: any) => {
	const mergedProviders = [
		...(config.providers ?? []),
		...(context?.providers ?? [])
	];

	// Forward the server BootstrapContext as the third argument so the platform is created
	return bootstrapApplication(AppComponent, { ...config, providers: mergedProviders }, context);
};

export default bootstrap;
