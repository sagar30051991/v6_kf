// Copyright (c) 2013, Web Notes Technologies Pvt. Ltd. and Contributors
// MIT License. See license.txt

// update parent select

frappe.ui.form.on("Website Settings", "refresh", function(frm) {
	if(user==="Administrator") {
		frm.add_custom_button("Export to Fixtures", function() {
			frappe.get_value({fieldname:"app", fieldtype:"Data", label:__("App Name"), reqd:1}, function(app) {
				frappe.call({
					method: "frappe.core.page.data_import_tool.data_import_tool.export_fixture",
					args: {
						app: app,
						doctype:"Website Settings",
						name:"Website Settings",
					},
					callback: function(r) {
						if(!r.exc) { msgprint(__("Exported")); }
					}
				})
			})
		})
	}
})

$.extend(cur_frm.cscript, {
	refresh: function(doc) {
	},
	onload_post_render: function(doc) {
		this.set_parent_label_options();
	},
	
	label: function(doc, cdt, cdn) {
		var item = frappe.model.get_doc(cdt, cdn);
		if(item.parentfield === "top_bar_items") {
			this.set_parent_label_options();
		}
	},
	
	parent_label: function(doc, cdt, cdn) {
		this.label(doc, cdt, cdn);
	},
	
	url: function(doc, cdt, cdn) {
		this.label(doc, cdt, cdn);
	},
	
	set_parent_label_options: function() {
		frappe.meta.get_docfield("Top Bar Item", "parent_label", cur_frm.docname).options = 
			this.get_parent_options("top_bar_items");
		
		if($(cur_frm.fields_dict.top_bar_items.grid.wrapper).find(".grid-row-open")) {
			cur_frm.fields_dict.top_bar_items.grid.refresh();
		}
	},
	
	// get labels of parent items
	get_parent_options: function(table_field) {
		var items = getchildren('Top Bar Item', cur_frm.doc.name, table_field);
		var main_items = [''];
		for(var i in items) {
			var d = items[i];
			if(!d.parent_label && !d.url && d.label) {
				main_items.push(d.label);
			}
		}
		return main_items.join('\n');
	}
});

cur_frm.cscript.set_banner_from_image = function(doc) {
	if(!doc.banner_image) {
		msgprint(frappe._("Select a Banner Image first."));
	}
	var src = doc.banner_image;
	cur_frm.set_value("banner_html", "<a href='/'><img src='"+ src
		+"' style='max-width: 200px;'></a>");
}