"""Build a synthetic SEC Form D quarter (2026q2) + a prior quarter for history, in the real TSV shape.
Every branch of the pipeline gets one issuer. Run:  python tests/make_fixture.py && python formd_pipeline.py build ...
"""
from pathlib import Path

ROOT = Path(__file__).parent / "fixture_raw"

SUB_COLS = ["ACCESSIONNUMBER", "FILE_NUM", "FILING_DATE", "SIC_CODE", "SUBMISSIONTYPE", "OVER100PERSONSFLAG", "OVER100ISSUERFLAG"]
ISS_COLS = ["ACCESSIONNUMBER", "IS_PRIMARYISSUER_FLAG", "ISSUER_SEQ_KEY", "CIK", "ENTITYNAME", "STREET1", "STREET2", "CITY",
            "STATEORCOUNTRY", "STATEORCOUNTRYDESCRIPTION", "ZIPCODE", "ISSUERPHONENUMBER", "JURISDICTIONOFINC",
            "ISSUER_PREVIOUSNAME_1", "ISSUER_PREVIOUSNAME_2", "ISSUER_PREVIOUSNAME_3", "EDGAR_PREVIOUSNAME_1",
            "EDGAR_PREVIOUSNAME_2", "EDGAR_PREVIOUSNAME_3", "ENTITYTYPE", "ENTITYTYPEOTHERDESC",
            "YEAROFINC_TIMESPAN_CHOICE", "YEAROFINC_VALUE_ENTERED"]
OFF_COLS = ["ACCESSIONNUMBER", "INDUSTRYGROUPTYPE", "INVESTMENTFUNDTYPE", "IS40ACT", "REVENUERANGE",
            "AGGREGATENETASSETVALUERANGE", "FEDERALEXEMPTIONS_ITEMS_LIST", "ISAMENDMENT", "PREVIOUSACCESSIONNUMBER",
            "SALE_DATE", "YETTOOCCUR", "MORETHANONEYEAR", "ISEQUITYTYPE", "ISDEBTTYPE", "ISOPTIONTOACQUIRETYPE",
            "ISSECURITYTOBEACQUIREDTYPE", "ISPOOLEDINVESTMENTFUNDTYPE", "ISTENANTINCOMMONTYPE", "ISMINERALPROPERTYTYPE",
            "ISOTHERTYPE", "DESCRIPTIONOFOTHERTYPE", "ISBUSINESSCOMBINATIONTRANS", "BUSCOMBCLARIFICATIONOFRESP",
            "MINIMUMINVESTMENTACCEPTED", "OVER100RECIPIENTFLAG", "TOTALOFFERINGAMOUNT", "TOTALAMOUNTSOLD",
            "TOTALREMAINING", "SALESAMOUNTSCLARIFICATIONOFRESP", "HASNONACCREDITEDINVESTORS",
            "NUMBERNONACCREDITEDINVESTORS", "TOTALNUMBERALREADYINVESTED", "SALESCOMM_DOLLARAMOUNT",
            "SALESCOMM_ISESTIMATE", "FINDERSFEE_DOLLARAMOUNT", "FINDERSFEE_ISESTIMATE", "FINDERFEECLARIFICATIONOFRESP",
            "GROSSPROCEEDSUSED_DOLLARAMOUNT", "GROSSPROCEEDSUSED_ISESTIMATE", "GROSSPROCEEDSUSED_CLARRESP",
            "AUTHORIZEDREPRESENTATIVE"]
REL_COLS = ["ACCESSIONNUMBER", "RELATEDPERSON_SEQ_KEY", "FIRSTNAME", "MIDDLENAME", "LASTNAME", "STREET1", "STREET2",
            "CITY", "STATEORCOUNTRY", "STATEORCOUNTRYDESCRIPTION", "ZIPCODE", "RELATIONSHIP_1", "RELATIONSHIP_2",
            "RELATIONSHIP_3", "RELATIONSHIPCLARIFICATION"]

# (acc, cik, name, filing_date, sic, state, industry, exemptions, total, sold, investors, min_inv, salescomm, amend)
CASES = [
    ("0001-26-000001", "1001", "Timberline Apartment Income Fund IV LP", "05-APR-2026", "6798", "MN", "REITS and Finance", "06c", "40000000", "16350000", "127", "50000", "0", "false"),  # candidate, retail, fresh-ish, day 05 (date bug case)
    ("0001-26-000002", "1002", "Harbor Point Capital Fund II LLC", "22-MAY-2026", "6770", "TX", "Pooled Investment Fund", "06c;3C.1", "60000000", "17750000", "49", "100000", "0", "false"),  # candidate via name? "Capital Fund" - no RE term → not_real_estate
    ("0001-26-000003", "1003", "Copper Creek Self Storage Partners LLC", "03-JUN-2026", "", "MO", "Pooled Investment Fund", "06c", "25000000", "2250000", "24", "25000", "0", "false"),  # candidate via name sweep (self storage)
    ("0001-26-000004", "1004", "Sunbelt Multifamily Growth Fund LP", "12-JUN-2026", "6513", "TX", "Residential", "06b", "30000000", "5000000", "40", "50000", "0", "false"),  # dropped: 506b
    ("0001-26-000005", "1005", "Small Realty Ventures LLC", "14-JUN-2026", "6512", "OK", "Commercial", "06c", "5000000", "1000000", "10", "25000", "0", "false"),  # dropped: under $10M
    ("0001-26-000006", "1006", "Closed Storage Fund I LP", "01-APR-2026", "6512", "FL", "Other Real Estate", "06c", "20000000", "20000000", "80", "50000", "0", "false"),  # dropped: fully sold
    ("0001-26-000007", "1007", "Meridian Industrial Core Fund LP", "18-APR-2026", "6512", "NY", "Commercial", "06c", "500000000", "210000000", "12", "5000000", "0", "false"),  # second screen: institutional_check (17.5M avg) + min inv
    ("0001-26-000008", "1008", "Gulf Coast Apartments Fund III LP", "20-APR-2026", "6513", "TX", "Residential", "06c", "35000000", "9000000", "60", "50000", "450000", "false"),  # second screen: placement_agent
    ("0001-26-000009", "1009", "Hines US Property Partners Feeder LP", "02-MAY-2026", "6798", "TX", "REITS and Finance", "06c", "1000000000", "300000000", "200", "1000000", "0", "false"),  # institutional_brand (and feeder, min inv)
    ("0001-26-000010", "1010", "Euro Logistics SCSp", "09-MAY-2026", "6798", "L3", "Other Real Estate", "06c", "150000000", "30000000", "15", "250000", "0", "false"),  # offshore_feeder / non_us
    ("0001-26-000011", "1011", "Nitya Capital Multifamily Fund V LLC", "07-JUN-2026", "6513", "TX", "Residential", "06c", "50000000", "22000000", "150", "50000", "0", "false"),  # HELD: distress
    ("0001-26-000012", "1012", "Blank Slate Realty Opportunity Fund LLC", "25-JUN-2026", "6512", "GA", "Commercial", "06c", "15000000", "0", "0", "50000", "0", "false"),  # candidate but zero-investor shell → low score
    ("0001-26-000013", "1013", "Indefinite Realty Income REIT Inc", "11-MAY-2026", "6798", "AZ", "REITS and Finance", "06c", "Indefinite", "8000000", "70", "5000", "0", "false"),  # dropped: indefinite
    ("0001-26-000014", "1014", "Platform Multifamily Fund LXII LP", "30-JUN-2026", "6513", "CA", "Residential", "06c", "45000000", "10000000", "90", "50000", "0", "false"),  # platform_filer via 61 prior filings in prior quarter
    ("0001-26-000015", "1001", "Timberline Apartment Income Fund IV LP", "28-JUN-2026", "6798", "MN", "REITS and Finance", "06c", "40000000", "18100000", "141", "50000", "0", "true"),  # amendment of #1 → latest per CIK? different CIK here on purpose: same name stem, tests stem history
]


def write(path: Path, cols, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        f.write("\t".join(cols) + "\n")
        for r in rows:
            d = dict(zip(cols, [""] * len(cols)))
            d.update(r)
            f.write("\t".join(d[c] for c in cols) + "\n")


def quarter(name: str, cases, extra_history=()):
    q = ROOT / name
    subs, iss, offs, rels = [], [], [], []
    for (acc, cik, nm, fdate, sic, st, ind, ex, tot, sold, inv, mininv, sc, amend) in cases:
        subs.append({"ACCESSIONNUMBER": acc, "FILE_NUM": "021-" + acc[-6:], "FILING_DATE": fdate, "SIC_CODE": sic, "SUBMISSIONTYPE": "D/A" if amend == "true" else "D"})
        iss.append({"ACCESSIONNUMBER": acc, "IS_PRIMARYISSUER_FLAG": "true", "ISSUER_SEQ_KEY": "1", "CIK": cik.zfill(10), "ENTITYNAME": nm,
                    "CITY": "Somewhere", "STATEORCOUNTRY": st, "ISSUERPHONENUMBER": "405-555-0100", "JURISDICTIONOFINC": "DE" if st != "L3" else "N4", "ENTITYTYPE": "Limited Partnership"})
        offs.append({"ACCESSIONNUMBER": acc, "INDUSTRYGROUPTYPE": ind, "INVESTMENTFUNDTYPE": "Other Investment Fund" if ind == "Pooled Investment Fund" else "",
                     "FEDERALEXEMPTIONS_ITEMS_LIST": ex, "ISAMENDMENT": amend, "MINIMUMINVESTMENTACCEPTED": mininv,
                     "TOTALOFFERINGAMOUNT": tot, "TOTALAMOUNTSOLD": sold, "TOTALNUMBERALREADYINVESTED": inv, "SALESCOMM_DOLLARAMOUNT": sc,
                     "ISPOOLEDINVESTMENTFUNDTYPE": "true" if ind == "Pooled Investment Fund" else "false"})
        rels.append({"ACCESSIONNUMBER": acc, "RELATEDPERSON_SEQ_KEY": "1", "FIRSTNAME": "Jane", "LASTNAME": "Sponsor",
                     "RELATIONSHIP_1": "Executive Officer", "RELATIONSHIP_2": "Director", "RELATIONSHIPCLARIFICATION": "Managing Principal"})
        rels.append({"ACCESSIONNUMBER": acc, "RELATEDPERSON_SEQ_KEY": "2", "FIRSTNAME": "N/A", "LASTNAME": "N/A", "RELATIONSHIP_1": "Promoter"})
    for h in extra_history:
        subs.append({"ACCESSIONNUMBER": h[0], "FILING_DATE": h[3], "SIC_CODE": "6513", "SUBMISSIONTYPE": "D"})
        iss.append({"ACCESSIONNUMBER": h[0], "IS_PRIMARYISSUER_FLAG": "true", "CIK": h[1].zfill(10), "ENTITYNAME": h[2], "STATEORCOUNTRY": "CA"})
        offs.append({"ACCESSIONNUMBER": h[0], "INDUSTRYGROUPTYPE": "Residential", "FEDERALEXEMPTIONS_ITEMS_LIST": "06b", "ISAMENDMENT": "false",
                     "TOTALOFFERINGAMOUNT": "20000000", "TOTALAMOUNTSOLD": "20000000", "TOTALNUMBERALREADYINVESTED": "50"})
    write(q / "FORMDSUBMISSION.tsv", SUB_COLS, subs)
    write(q / "ISSUERS.tsv", ISS_COLS, iss)
    write(q / "OFFERING.tsv", OFF_COLS, offs)
    write(q / "RELATEDPERSONS.tsv", REL_COLS, rels)


if __name__ == "__main__":
    # prior quarter: 61 filings by the platform filer's CIK, 4 by Copper Creek's stem, 1 by Timberline's CIK
    hist = [(f"0001-25-0{i:05d}", "1014", f"Platform Multifamily Fund {i} LP", "15-JAN-2026") for i in range(1, 62)]
    hist += [(f"0002-25-0{i:05d}", "1003", "Copper Creek Self Storage Partners II LLC", "10-FEB-2026") for i in range(1, 5)]
    hist += [("0003-25-000001", "1001", "Timberline Apartment Income Fund III LP", "02-MAR-2026")]
    quarter("2026q1_d", [], extra_history=hist)
    quarter("2026q2_d", CASES)
    print(f"fixture written to {ROOT}")
