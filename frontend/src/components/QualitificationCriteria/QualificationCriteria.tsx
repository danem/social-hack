import React from 'react';

export default function QualificationCriteria() {
    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-semibold text-center mb-4">Qualification Criteria Settings</h2>
            <form className="space-y-4">
                <div>
                    <label className="font-bold">Program Area:</label>
                    <div>
                        <input type="checkbox" id="sanMateo" name="programArea" value="San Mateo Area" className="mr-2" />
                        <label htmlFor="sanMateo">San Mateo Area</label>
                    </div>
                    <div>
                        <input type="checkbox" id="mountainView" name="programArea" value="Mountain View" className="mr-2" />
                        <label htmlFor="mountainView">Mountain View</label>
                    </div>
                    <div>
                        <input type="checkbox" id="eastPaloAlto" name="programArea" value="East Palo Alto" className="mr-2" />
                        <label htmlFor="eastPaloAlto">East Palo Alto</label>
                    </div>
                    <div>
                        <input type="checkbox" id="otherArea" name="programArea" value="Other" className="mr-2" />
                        <label htmlFor="otherArea">Other</label>
                    </div>
                </div>

                <div>
                    <label className="font-bold">Income Level:</label>
                    <div>
                        <input type="checkbox" id="below30k" name="incomeLevel" value="Below $30,000" className="mr-2" />
                        <label htmlFor="below30k">Below $30,000</label>
                    </div>
                    <div>
                        <input type="checkbox" id="30kto60k" name="incomeLevel" value="$30,000 - $60,000" className="mr-2" />
                        <label htmlFor="30kto60k">$30,000 - $60,000</label>
                    </div>
                    <div>
                        <input type="checkbox" id="above60k" name="incomeLevel" value="Above $60,000" className="mr-2" />
                        <label htmlFor="above60k">Above $60,000</label>
                    </div>
                </div>

                <div>
                    <label htmlFor="householdSize" className="font-bold">Household Size:</label>
                    <input
                        type="text"
                        id="householdSize"
                        name="householdSize"
                        placeholder="e.g., 4"
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="p-4 border border-dashed border-gray-300 rounded-md bg-gray-50">
                    <p className="font-semibold mb-2">Add Additional Qualifying Parameter:</p>
                    <div>
                        <label htmlFor="parameterName" className="font-bold">Parameter Name:</label>
                        <input
                            type="text"
                            id="parameterName"
                            name="parameterName"
                            placeholder="e.g., Employment Status"
                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="parameterValue" className="font-bold">Parameter Value:</label>
                        <input
                            type="text"
                            id="parameterValue"
                            name="parameterValue"
                            placeholder="e.g., Full-Time"
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                <div className="flex justify-center mt-4">
                    <button type="button" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                        Save Criteria
                    </button>
                </div>
            </form>
        </div>
    );
}
