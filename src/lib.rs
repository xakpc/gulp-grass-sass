// Deny all clippy lints to enforce good coding practices.
#![deny(clippy::all)]

// Macro use to import the procedural macro from napi_derive.
#[macro_use]
extern crate napi_derive;

use std::path::Path;
use grass::{Options, InputSyntax};

#[napi(object)]
pub struct SassOptions {
  pub data: Option<String>,
  pub file: Option<String>,  
  pub intended_syntax : Option<bool>,
  pub include_paths : Option<Vec<String>>,
}

#[napi]
pub fn compile_sass(input: String) -> Result<String, napi::Error> {
    grass::from_string(input, &Options::default())
        .map_err(|e| napi::Error::from_reason(e.to_string()))
}

#[napi]
pub fn compile_sass_from_file(file_path: String) -> Result<String, napi::Error> {
    // Convert the input path to a Path reference.
    let path = Path::new(&file_path);

    grass::from_path(path, &Options::default())
        .map_err(|e| napi::Error::from_reason(e.to_string()))
}

#[napi]
pub fn compile_sass_from_options(options: SassOptions) -> Result<String, napi::Error> {
    let mut grass_options = Options::default();

    // Add include paths if provided.
    if let Some(include_paths) = options.include_paths {
		let path_refs: Vec<&Path> = include_paths.iter().map(|p| Path::new(p)).collect();
        if path_refs.len() > 0 {
            grass_options = grass_options.load_paths(&path_refs);
        }		
	}

    // Set type of code (sass/scss) from intended syntax if provided.
    if let Some(intended_syntax) = options.intended_syntax {
        if intended_syntax { 
            grass_options = grass_options.input_syntax(InputSyntax::Sass); }
	    else {
            grass_options = grass_options.input_syntax(InputSyntax::Scss); }
    }
    
    // Compile from string if `data` is provided.
    if let Some(data) = options.data {
        return grass::from_string(data, &grass_options)
            .map_err(|e| napi::Error::from_reason(e.to_string()));
    }

    // Compile from file if `file` is provided.
    if let Some(ref file_path) = options.file {
        let path = Path::new(file_path);

        return grass::from_path(path, &grass_options)
            .map_err(|e| napi::Error::from_reason(e.to_string()));
    }

    // If neither `data` nor `file` is provided, return an error.
    Err(napi::Error::from_reason("Either `data` or `file` must be provided".to_string()))
}