{
	"patcher" : 	{
		"fileversion" : 1,
		"appversion" : 		{
			"major" : 8,
			"minor" : 5,
			"revision" : 5,
			"architecture" : "x64",
			"modernui" : 1
		}
,
		"classnamespace" : "box",
		"rect" : [ 717.0, 195.0, 945.0, 848.0 ],
		"bglocked" : 0,
		"openinpresentation" : 0,
		"default_fontsize" : 12.0,
		"default_fontface" : 0,
		"default_fontname" : "Arial",
		"gridonopen" : 1,
		"gridsize" : [ 15.0, 15.0 ],
		"gridsnaponopen" : 1,
		"objectsnaponopen" : 1,
		"statusbarvisible" : 2,
		"toolbarvisible" : 1,
		"lefttoolbarpinned" : 0,
		"toptoolbarpinned" : 0,
		"righttoolbarpinned" : 0,
		"bottomtoolbarpinned" : 0,
		"toolbars_unpinned_last_save" : 0,
		"tallnewobj" : 0,
		"boxanimatetime" : 200,
		"enablehscroll" : 1,
		"enablevscroll" : 1,
		"devicewidth" : 0.0,
		"description" : "",
		"digest" : "",
		"tags" : "",
		"style" : "",
		"subpatcher_template" : "",
		"assistshowspatchername" : 0,
		"boxes" : [ 			{
				"box" : 				{
					"id" : "obj-9",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 218.0, 381.0, 61.0, 22.0 ],
					"text" : "log-model"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-7",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 233.0, 484.0, 85.0, 22.0 ],
					"text" : "model banana"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-10",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 115.0, 484.0, 76.0, 22.0 ],
					"text" : "push-prompt"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-8",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 233.0, 455.0, 72.0, 22.0 ],
					"text" : "model gpt-4"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-3",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 115.0, 455.0, 113.0, 22.0 ],
					"text" : "model gpt-3.5-turbo"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-2",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 558.0, 496.0, 33.0, 22.0 ],
					"text" : "read"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-4",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 0,
					"patcher" : 					{
						"fileversion" : 1,
						"appversion" : 						{
							"major" : 8,
							"minor" : 5,
							"revision" : 5,
							"architecture" : "x64",
							"modernui" : 1
						}
,
						"classnamespace" : "box",
						"rect" : [ 986.0, 321.0, 640.0, 480.0 ],
						"bglocked" : 0,
						"openinpresentation" : 0,
						"default_fontsize" : 12.0,
						"default_fontface" : 0,
						"default_fontname" : "Arial",
						"gridonopen" : 1,
						"gridsize" : [ 15.0, 15.0 ],
						"gridsnaponopen" : 1,
						"objectsnaponopen" : 1,
						"statusbarvisible" : 2,
						"toolbarvisible" : 1,
						"lefttoolbarpinned" : 0,
						"toptoolbarpinned" : 0,
						"righttoolbarpinned" : 0,
						"bottomtoolbarpinned" : 0,
						"toolbars_unpinned_last_save" : 0,
						"tallnewobj" : 0,
						"boxanimatetime" : 200,
						"enablehscroll" : 1,
						"enablevscroll" : 1,
						"devicewidth" : 0.0,
						"description" : "",
						"digest" : "",
						"tags" : "",
						"style" : "",
						"subpatcher_template" : "",
						"assistshowspatchername" : 0,
						"boxes" : [ 							{
								"box" : 								{
									"id" : "obj-3",
									"maxclass" : "newobj",
									"numinlets" : 1,
									"numoutlets" : 0,
									"patching_rect" : [ 115.0, 137.0, 56.0, 22.0 ],
									"text" : "maxGPT"
								}

							}
, 							{
								"box" : 								{
									"comment" : "",
									"id" : "obj-1",
									"index" : 1,
									"maxclass" : "inlet",
									"numinlets" : 0,
									"numoutlets" : 1,
									"outlettype" : [ "" ],
									"patching_rect" : [ 115.0, 81.0, 30.0, 30.0 ]
								}

							}
, 							{
								"box" : 								{
									"id" : "obj-2",
									"linecount" : 6,
									"maxclass" : "newobj",
									"numinlets" : 0,
									"numoutlets" : 0,
									"patching_rect" : [ 20.0, 40.0, 100.0, 89.0 ],
									"text" : "\"/Users/twhiston/Documents/Max 8/Packages/maxGPT/.maxGPT/1694114923259_0.maxpat\""
								}

							}
, 							{
								"box" : 								{
									"id" : "obj-4",
									"linecount" : 6,
									"maxclass" : "newobj",
									"numinlets" : 0,
									"numoutlets" : 0,
									"patching_rect" : [ 20.0, 40.0, 100.0, 89.0 ],
									"text" : "\"/Users/twhiston/Documents/Max 8/Packages/maxGPT/.maxGPT/1694114961196_0.maxpat\""
								}

							}
, 							{
								"box" : 								{
									"id" : "obj-5",
									"linecount" : 6,
									"maxclass" : "newobj",
									"numinlets" : 0,
									"numoutlets" : 0,
									"patching_rect" : [ 20.0, 40.0, 100.0, 89.0 ],
									"text" : "\"/Users/twhiston/Documents/Max 8/Packages/maxGPT/.maxGPT/1694115030207_0.maxpat\""
								}

							}
, 							{
								"box" : 								{
									"id" : "obj-6",
									"linecount" : 6,
									"maxclass" : "newobj",
									"numinlets" : 0,
									"numoutlets" : 0,
									"patching_rect" : [ 20.0, 40.0, 100.0, 89.0 ],
									"text" : "\"/Users/twhiston/Documents/Max 8/Packages/maxGPT/.maxGPT/1694115791022_0.maxpat\""
								}

							}
, 							{
								"box" : 								{
									"id" : "obj-7",
									"linecount" : 6,
									"maxclass" : "newobj",
									"numinlets" : 0,
									"numoutlets" : 0,
									"patching_rect" : [ 20.0, 40.0, 100.0, 0.0 ],
									"text" : "\"/Users/twhiston/Documents/Max 8/Packages/maxGPT/.maxGPT/1694115792248_0.maxpat\""
								}

							}
, 							{
								"box" : 								{
									"id" : "obj-8",
									"linecount" : 6,
									"maxclass" : "newobj",
									"numinlets" : 0,
									"numoutlets" : 0,
									"patching_rect" : [ 20.0, 40.0, 100.0, 0.0 ],
									"text" : "\"/Users/twhiston/Documents/Max 8/Packages/maxGPT/.maxGPT/1694115795013_0.maxpat\""
								}

							}
, 							{
								"box" : 								{
									"id" : "obj-9",
									"linecount" : 6,
									"maxclass" : "newobj",
									"numinlets" : 0,
									"numoutlets" : 0,
									"patching_rect" : [ 20.0, 40.0, 100.0, 0.0 ],
									"text" : "\"/Users/twhiston/Documents/Max 8/Packages/maxGPT/.maxGPT/1694116109521_0.maxpat\""
								}

							}
, 							{
								"box" : 								{
									"id" : "obj-10",
									"linecount" : 6,
									"maxclass" : "newobj",
									"numinlets" : 0,
									"numoutlets" : 0,
									"patching_rect" : [ 20.0, 40.0, 100.0, 0.0 ],
									"text" : "\"/Users/twhiston/Documents/Max 8/Packages/maxGPT/.maxGPT/1694116143386_0.maxpat\""
								}

							}
, 							{
								"box" : 								{
									"id" : "obj-11",
									"linecount" : 6,
									"maxclass" : "newobj",
									"numinlets" : 0,
									"numoutlets" : 0,
									"patching_rect" : [ 20.0, 40.0, 100.0, 0.0 ],
									"text" : "\"/Users/twhiston/Documents/Max 8/Packages/maxGPT/.maxGPT/1694116161720_0.maxpat\""
								}

							}
 ],
						"lines" : [ 							{
								"patchline" : 								{
									"destination" : [ "obj-3", 0 ],
									"source" : [ "obj-1", 0 ]
								}

							}
 ]
					}
,
					"patching_rect" : [ 192.0, 541.0, 62.0, 22.0 ],
					"saved_object_attributes" : 					{
						"description" : "",
						"digest" : "",
						"globalpatchername" : "",
						"tags" : ""
					}
,
					"text" : "p wrapper"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-12",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 397.0, 496.0, 75.0, 22.0 ],
					"text" : "prepend ask"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-11",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 397.0, 455.0, 355.0, 22.0 ],
					"text" : "\"make a patch which quantizes incoming midi to a C major scale\""
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-6",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 18.0, 484.0, 93.0, 22.0 ],
					"text" : "prepend prompt"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-5",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 480.0, 496.0, 71.0, 22.0 ],
					"text" : "clear-cache"
				}

			}
 ],
		"lines" : [ 			{
				"patchline" : 				{
					"destination" : [ "obj-4", 0 ],
					"source" : [ "obj-10", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-12", 0 ],
					"source" : [ "obj-11", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-4", 0 ],
					"source" : [ "obj-12", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-4", 0 ],
					"source" : [ "obj-2", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-4", 0 ],
					"source" : [ "obj-3", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-4", 0 ],
					"source" : [ "obj-5", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-4", 0 ],
					"source" : [ "obj-6", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-4", 0 ],
					"source" : [ "obj-7", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-4", 0 ],
					"source" : [ "obj-8", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-4", 0 ],
					"source" : [ "obj-9", 0 ]
				}

			}
 ],
		"dependency_cache" : [ 			{
				"name" : "1694114923259_0.maxpat",
				"bootpath" : "~/Documents/Max 8/Packages/maxGPT/.maxGPT",
				"patcherrelativepath" : "../.maxGPT",
				"type" : "JSON",
				"implicit" : 1
			}
, 			{
				"name" : "1694114961196_0.maxpat",
				"bootpath" : "~/Documents/Max 8/Packages/maxGPT/.maxGPT",
				"patcherrelativepath" : "../.maxGPT",
				"type" : "JSON",
				"implicit" : 1
			}
, 			{
				"name" : "1694115030207_0.maxpat",
				"bootpath" : "~/Documents/Max 8/Packages/maxGPT/.maxGPT",
				"patcherrelativepath" : "../.maxGPT",
				"type" : "JSON",
				"implicit" : 1
			}
, 			{
				"name" : "1694115791022_0.maxpat",
				"bootpath" : "~/Documents/Max 8/Packages/maxGPT/.maxGPT",
				"patcherrelativepath" : "../.maxGPT",
				"type" : "JSON",
				"implicit" : 1
			}
, 			{
				"name" : "1694115792248_0.maxpat",
				"bootpath" : "~/Documents/Max 8/Packages/maxGPT/.maxGPT",
				"patcherrelativepath" : "../.maxGPT",
				"type" : "JSON",
				"implicit" : 1
			}
, 			{
				"name" : "1694115795013_0.maxpat",
				"bootpath" : "~/Documents/Max 8/Packages/maxGPT/.maxGPT",
				"patcherrelativepath" : "../.maxGPT",
				"type" : "JSON",
				"implicit" : 1
			}
, 			{
				"name" : "1694116109521_0.maxpat",
				"bootpath" : "~/Documents/Max 8/Packages/maxGPT/.maxGPT",
				"patcherrelativepath" : "../.maxGPT",
				"type" : "JSON",
				"implicit" : 1
			}
, 			{
				"name" : "1694116143386_0.maxpat",
				"bootpath" : "~/Documents/Max 8/Packages/maxGPT/.maxGPT",
				"patcherrelativepath" : "../.maxGPT",
				"type" : "JSON",
				"implicit" : 1
			}
, 			{
				"name" : "1694116161720_0.maxpat",
				"bootpath" : "~/Documents/Max 8/Packages/maxGPT/.maxGPT",
				"patcherrelativepath" : "../.maxGPT",
				"type" : "JSON",
				"implicit" : 1
			}
, 			{
				"name" : "fit_jweb_to_bounds.js",
				"bootpath" : "C74:/packages/Node for Max/patchers/debug-monitor",
				"type" : "TEXT",
				"implicit" : 1
			}
, 			{
				"name" : "maxGPT.maxpat",
				"bootpath" : "~/Documents/Max 8/Packages/maxGPT/patchers",
				"patcherrelativepath" : ".",
				"type" : "JSON",
				"implicit" : 1
			}
, 			{
				"name" : "maxGPTMsgDisplayer.js",
				"bootpath" : "~/Documents/Max 8/Packages/maxGPT/javascript/maxjs",
				"patcherrelativepath" : "../javascript/maxjs",
				"type" : "TEXT",
				"implicit" : 1
			}
, 			{
				"name" : "maxGPTScriptParser.js",
				"bootpath" : "~/Documents/Max 8/Packages/maxGPT/javascript/maxjs",
				"patcherrelativepath" : "../javascript/maxjs",
				"type" : "TEXT",
				"implicit" : 1
			}
, 			{
				"name" : "maxgpt.js",
				"bootpath" : "~/Documents/Max 8/Packages/maxGPT/javascript/dist",
				"patcherrelativepath" : "../javascript/dist",
				"type" : "TEXT",
				"implicit" : 1
			}
, 			{
				"name" : "n4m.monitor.maxpat",
				"bootpath" : "C74:/packages/Node for Max/patchers/debug-monitor",
				"type" : "JSON",
				"implicit" : 1
			}
, 			{
				"name" : "resize_n4m_monitor_patcher.js",
				"bootpath" : "C74:/packages/Node for Max/patchers/debug-monitor",
				"type" : "TEXT",
				"implicit" : 1
			}
, 			{
				"name" : "tw.gl.repl.dynamic-size-helper.maxpat",
				"bootpath" : "~/Documents/Max 8/Packages/GLRepl/patchers",
				"patcherrelativepath" : "../../GLRepl/patchers",
				"type" : "JSON",
				"implicit" : 1
			}
, 			{
				"name" : "tw.gl.repl.js",
				"bootpath" : "~/Documents/Max 8/Packages/GLRepl/javascript/dist",
				"patcherrelativepath" : "../../GLRepl/javascript/dist",
				"type" : "TEXT",
				"implicit" : 1
			}
, 			{
				"name" : "tw.gl.repl.maxpat",
				"bootpath" : "~/Documents/Max 8/Packages/GLRepl/patchers",
				"patcherrelativepath" : "../../GLRepl/patchers",
				"type" : "JSON",
				"implicit" : 1
			}
, 			{
				"name" : "user-repl.js",
				"bootpath" : "~/Documents/Max 8/Packages/GLRepl/examples/custom-formatter",
				"patcherrelativepath" : "../../GLRepl/examples/custom-formatter",
				"type" : "TEXT",
				"implicit" : 1
			}
 ],
		"autosave" : 0
	}

}
