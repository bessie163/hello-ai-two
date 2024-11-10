/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// export interface Env {
// 	// If you set another name in wrangler.toml as the value for 'binding',
// 	// replace "AI" with the variable name you defined.
// 	AI: Ai;
//   }
  
//   export default {
// 	async fetch(request, env): Promise<Response> {
// 	  const response = await env.AI.run("@cf/black-forest-labs/flux-1-schnell", {
// 		prompt: "I like dinosaurs",
// 		width: 1024, 
// 		height: 1024, 
// 	  });
  
// 	  return new Response(JSON.stringify(response));
// 	},
//   } satisfies ExportedHandler<Env>;

import {saveAs} from 'file-saver';
import * as fs from 'fs';
import path from 'path';
//RUNS BUT DOESNT PRODUCE IMAGE
export interface Env {
	AI: any;
  }

  export default {
	async fetch(request, env): Promise<Response> {
	  const inputs = {
		prompt: "I like dinosaurs",
		// Add other parameters if necessary
	  };
  
	  try {
		// Call AI API to generate the base64 image
		const response = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', inputs);
		console.log("AI response received");
  
		// Extract the base64 image data from the response (assume it's a valid base64 string without the prefix)
		const base64Image = response.image;
  
		if (!base64Image) {
		  return new Response('No image data found', { status: 400 });
		}
  
		// If the base64 string doesn't have the prefix, add it manually
		const base64Data = `data:image/png;base64,${base64Image}`;
		
		// Clean up the base64 string by removing any invalid characters (spaces, newlines)
		const cleanedBase64Data = base64Data.replace(/\s+/g, '');
  
		console.log("Cleaned base64 data: ", cleanedBase64Data); // Debug log
  
		// Decode the base64 string into binary data
		const binaryData = new Uint8Array(atob(cleanedBase64Data.split(',')[1]) // Only take the part after the comma
		  .split('')
		  .map(c => c.charCodeAt(0)));
  
		// Create a Blob object for the image
		const blob = new Blob([binaryData], { type: 'image/png' });

		const filePath = path.join('/Users/hongmei_yu/hello-ai-two/src',"dino.png")
		
		// Write the file to the temporary directory in Deno

		// Return the image as a downloadable file
		return new Response(blob, {
		  status: 200,
		  headers: {
			'Content-Type': 'image/png',
			'Content-Disposition': 'attachment; filename="dinosaurs.png"',
		  },
		});
  
	  } catch (error: unknown) {
		console.error("Error:", error);
		const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
		return new Response(errorMessage, { status: 500 });
	  }
	},
  } satisfies ExportedHandler<Env>;
  
  
  
//   export default {
// 	async fetch(request, env): Promise<Response> {
// 	  const inputs = {
// 		prompt: "I like dinosaurs",
// 		// num_steps: 20,
// 		// // width: 1024,
// 		// // height: 1024,
// 		// seed: Math.floor(Math.random() * 1000000)
// 	  };
  
// 	  try {
// 		const response = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', inputs);
// 		console.log("Test 1")
// 		const base64Image = response.image;
// 		console.log("Test 2")
// 		const base64Data = base64Image.split(',')[1];

// 		console.log("current base64Data:")
	
// 		const img = new Response('data: image/png;base64, ${response.image}', {
// 			headers: {
// 			  'Content-Type': 'image/png'
// 			}
// 		});
// 		console.log("Test 4")
// 		//saveAs(new Blob(base64Data),'image/test.png')
// 		console.log("Completed try")
// 		return img;
// 	  } catch (error: unknown) {
// 		console.log("test 3")
// 		const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
// 		return new Response(errorMessage, { status: 500 });
// 	  }
// 	},
//   } satisfies ExportedHandler<Env>;

  