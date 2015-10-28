
<!-- We don't need full layout here, because this page will be parsed with Ajax-->
<!-- Top Navbar-->
<div class="navbar">
  <div class="navbar-inner">
    <div class="left"><a href="#" class="back link"> <i class="icon icon-back"></i><span>Back</span></a></div>
    <div class="center sliding">Form1</div>
    <div class="right">
      <!-- Right link contains only icon - additional "icon-only" class--><a href="#" class="link icon-only open-panel"> <i class="icon icon-bars"></i></a>
    </div>
  </div>
</div>
<div class="pages">
  <!-- Page, data-page contains page name-->
  <div data-page="form" class="page">
    <!-- Scrollable page content-->
    <div class="page-content">
	  <div class="content-block-title" id="photon-name">Photon Settings</div>	  
	  <form id="my-form3" class="list-block store-data">      
	  <div class="list-block">
        
		<ul>
          <li>
            <div class="item-content">
              <div class="item-media"><i class="icon icon-form-DeviceID"></i></div>
              <div class="item-inner"> 
                <div class="item-title label">DeviceID</div>
                <div class="item-input">
                  <input type="text" placeholder="3f0032000547343232363230" id="ParticleID"name="DeviceID"/>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div class="item-content">
              <div class="item-media"><i class="icon icon-form-Token"></i></div>
              <div class="item-inner"> 
                <div class="item-title label">Access Token</div>
                <div class="item-input">
                  <input type="text" placeholder="6182a520f85675e04c864ec65e1d2ad1943089c1" id="ParticleToken" name= "token"/>
                </div>
              </div>
            </div>
          </li> 
		  <li>
            <div class="item-content">
              <div class="item-media"><i class="icon icon-form-Token"></i></div>
              <div class="item-inner"> 
                <div class="item-title label">Left Door Pin</div>
                <div class="item-input">
                  <input type="text" placeholder="1" id="Lpin" name= "Lpin"/>
                </div>
              </div>
            </div>
          </li> 		  
		  <li>
            <div class="item-content">
              <div class="item-media"><i class="icon icon-form-Token"></i></div>
              <div class="item-inner"> 
                <div class="item-title label">Right Door Pin</div>
                <div class="item-input">
                  <input type="text" placeholder="2" id="Rpin" name= "Rpin"/>
                </div>
              </div>
            </div>
          </li>
		  <li>
		  <div class="row">
			  <div class="col-50">
				<p> Display Name</p>
			  </div>
			  <div class="col-50">
				<div class="item-input">
				  <p>Output Pin</p>
				</div>
			 </div>
		  </div>
          </li>
		  <div class="row">
			  <div class="col-50">
				<input type="text" placeholder="PinName" id="S1pinName" name="S1pinName"/>
			  </div>
			  <div class="col-50">
				<div class="item-input">
				  <input type="text" placeholder="2" id="S1pin" name= "S1pin"/>
				</div>
			 </div>
		  </div>
          </li>
		  <li>
		  <div class="row">
			  <div class="col-50">
				<input type="text" placeholder="PinName" id="S2pinName" name="S2pinName"/>
			  </div>
			  <div class="col-50">
				<div class="item-input">
				  <input type="text" placeholder="2" id="S2pin" name= "S2pin"/>
				</div>
			 </div>
		  </div>
          </li>
		  <li>
		  <div class="row">
			  
			  <div class="col-50">
				<input type="text" placeholder="PinName" id="S3pinName" name="S3pinName"/>
			  </div>
			  <div class="col-50">
				<div class="item-input">
				  <input type="text" placeholder="2" id="S3pin" name= "S3pin"/>
				</div>
			 </div>
		  </div>
          </li>
		  <li>
		  <div class="row">
			 
			  <div class="col-50">
				<input type="text" placeholder="PinName" id="S4pinName" name="S4pinName"/>
			  </div>
			  <div class="col-50">
				<div class="item-input">
				  <input type="text" placeholder="2" id="S4pin" name= "S4pin"/>
				</div>
			 </div>
		  </div>
          </li>
		  <li>
		  <div class="row">
			 
			  <div class="col-50">
				<input type="text" placeholder="PinName" id="S5pinName" name="S5pinName"/>
			  </div>
			  <div class="col-50">
				<div class="item-input">
				  <input type="text" placeholder="2" id="S5pin" name= "S5pin"/>
				</div>
			 </div>
		  </div>
          </li>
		  
		  
      </form>
	  <div class="content-block">
        <div class="row">
          <div class="col-50"><a href="#" class="button button-big button-fill color-red delete-storage-data" >Cancel</a></div>
          <div class="col-50">
            <input type="submit" value="Submit" class="button button-big button-fill color-green save-storage-data" id="Submit"/>
			</div>
		</div>
	  </div>
	</div>
	 
    </div>
	</div>
	</div>
   
  
