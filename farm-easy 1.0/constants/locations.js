const locations = {
  'NG': [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT - Abuja",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara"
  ]
}

const tanzaniaStates = [
	{
		"name": "Arusha",
		"code": "TZ-01"
	},
	{
		"name": "Dar es Salaam",
		"code": "TZ-02"
	},
	{
		"name": "Dodoma",
		"code": "TZ-03"
	},
	{
		"name": "Iringa",
		"code": "TZ-04"
	},
	{
		"name": "Kagera",
		"code": "TZ-05"
	},
	{
		"name": "Kaskazini Pemba",
		"code": "TZ-06"
	},
	{
		"name": "Kaskazini Unguja",
		"code": "TZ-07"
	},
	{
		"name": "Kigoma",
		"code": "TZ-08"
	},
	{
		"name": "Kilimanjaro",
		"code": "TZ-09"
	},
	{
		"name": "Kusini Pemba",
		"code": "TZ-10"
	},
	{
		"name": "Kusini Unguja",
		"code": "TZ-11"
	},
	{
		"name": "Lindi",
		"code": "TZ-12"
	},
	{
		"name": "Manyara",
		"code": "TZ-26"
	},
	{
		"name": "Mara",
		"code": "TZ-13"
	},
	{
		"name": "Mbeya",
		"code": "TZ-14"
	},
	{
		"name": "Mjini Magharibi",
		"code": "TZ-15"
	},
	{
		"name": "Morogoro",
		"code": "TZ-16"
	},
	{
		"name": "Mtwara",
		"code": "TZ-17"
	},
	{
		"name": "Mwanza",
		"code": "TZ-18"
	},
	{
		"name": "Pwani",
		"code": "TZ-19"
	},
	{
		"name": "Rukwa",
		"code": "TZ-20"
	},
	{
		"name": "Ruvuma",
		"code": "TZ-21"
	},
	{
		"name": "Shinyanga",
		"code": "TZ-22"
	},
	{
		"name": "Singida",
		"code": "TZ-23"
	},
	{
		"name": "Tabora",
		"code": "TZ-24"
	},
	{
		"name": "Tanga",
		"code": "TZ-25"
	}
]

const tanzania = tanzaniaStates.map(stateOBJ => stateOBJ.name)
locations.TZ = tanzania

export default locations

export const countries = [
	["Nigeria", "NG"],
	["Tanzania", "TZ"]
]