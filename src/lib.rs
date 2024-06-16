// Deny all clippy lints to enforce good coding practices.
#![deny(clippy::all)]

// Macro use to import the procedural macro from napi_derive.
#[macro_use]
extern crate napi_derive;

use std::path::Path;
use grass::Options;

#[napi(string_enum)]
#[derive(Debug, Default)]
pub enum SassSyntax {
  Sass,
  Css,
  #[default]
  Scss,
}

#[napi(string_enum)]
#[derive(Debug, Default)]
pub enum SassOutputStyle {
  #[default]
  Expanded,
  Compressed,
}

#[napi(object)]
#[derive(Debug)]
pub struct SassOptions {
  pub data: Option<String>,
  pub file: Option<String>,  
  pub sass_syntax: Option<SassSyntax>,
  pub output_style: Option<SassOutputStyle>,
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

    // Set output style if provided.
    if let Some(output_style) = options.output_style {
		grass_options = grass_options.style(match output_style {
			SassOutputStyle::Expanded => grass::OutputStyle::Expanded,
			SassOutputStyle::Compressed => grass::OutputStyle::Compressed
		});
	}

    // Set type of code (sass/scss) from intended syntax if provided.
    if let Some(input_syntax) = options.sass_syntax {
        grass_options = grass_options.input_syntax(match input_syntax {
            SassSyntax::Css => grass::InputSyntax::Css,
            SassSyntax::Sass => grass::InputSyntax::Sass,
            SassSyntax::Scss => grass::InputSyntax::Scss      
      });
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